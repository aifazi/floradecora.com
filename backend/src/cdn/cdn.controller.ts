import { Controller, Get, Put, Post, Param, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { z } from 'zod';
import { assertSafeUrl } from '../common/util/url';
import { CdnService } from './cdn.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';

@Controller('cdn')
@UseGuards(JwtOrApiKeyGuard)
export class CdnController {
  constructor(private readonly cdnService: CdnService) {}

  @Get('providers')
  listProviders() {
    return this.cdnService.listProviders();
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
    for (const field of ['endpoint', 'host', 'url', 'storageZone']) {
      const val = cfg[field];
      if (typeof val === 'string' && /^https?:\/\//i.test(val)) assertSafeUrl(val);
    }
    return this.cdnService.upsertProvider(provider, parsed.data.config, parsed.data.active);
  }

  @Post('providers/:provider/test')
  testProvider(@Param('provider') provider: string) {
    return this.cdnService.testProvider(provider);
  }
}
