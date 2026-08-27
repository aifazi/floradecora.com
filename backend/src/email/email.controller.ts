import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
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
  upsertProvider(@Param('provider') provider: string, @Body() body: { config: unknown; active: boolean }) {
    return this.emailService.upsertProvider(provider, body.config, body.active);
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

  @Post('send')
  async send(@Body() body: { to: string; subject: string; body: string; template?: string }) {
    return this.emailService.enqueue(body);
  }
}
