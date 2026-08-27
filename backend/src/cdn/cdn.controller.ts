import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
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
  upsertProvider(@Param('provider') provider: string, @Body() body: { config: unknown; active: boolean }) {
    return this.cdnService.upsertProvider(provider, body.config, body.active);
  }

  @Post('providers/:provider/test')
  testProvider(@Param('provider') provider: string) {
    return this.cdnService.testProvider(provider);
  }
}
