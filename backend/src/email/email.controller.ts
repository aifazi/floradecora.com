import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { z } from 'zod';
import { assertSafeUrl } from '../common/util/url';
import { EmailService } from './email.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';

@Controller('email')
@UseGuards(JwtOrApiKeyGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('providers')
  listProviders() {
    return this.emailService.listProviders();
  }

  @Put('providers/:provider')
  upsertProvider(@Param('provider') provider: string, @Body() body: unknown) {
    const schema = z.object({
      config: z.record(z.unknown()).optional(),
      active: z.boolean(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid provider config', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    // SSRF guard: reject any configured http(s) endpoint pointing at private/loopback addresses
    const cfg = (parsed.data.config || {}) as Record<string, unknown>;
    for (const field of ['endpoint', 'host', 'url', 'smtpHost']) {
      const val = cfg[field];
      if (typeof val === 'string' && /^https?:\/\//i.test(val)) assertSafeUrl(val);
    }
    return this.emailService.upsertProvider(provider, parsed.data.config, parsed.data.active);
  }

  @Post('providers/:provider/test')
  testProvider(@Param('provider') provider: string) {
    return this.emailService.testProvider(provider);
  }

  @Get('logs')
  listLogs(@Query('status') status?: string, @Query('search') search?: string, @Query('take') take?: string) {
    return this.emailService.listLogs({ status, search, take: take ? parseInt(take) : undefined });
  }

  @Get('queue')
  listQueue(@Query('status') status?: string) {
    return this.emailService.listQueue(status);
  }

  @Post('queue/:id/retry')
  retry(@Param('id') id: string) {
    return this.emailService.retryQueue(id);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('send')
  async send(@Body() body: unknown) {
    const schema = z.object({
      to: z.string().email().max(320),
      subject: z.string().min(1).max(300),
      body: z.string().min(1).max(10000),
      template: z.string().max(100).optional(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid input', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.emailService.enqueue(parsed.data);
  }
}
