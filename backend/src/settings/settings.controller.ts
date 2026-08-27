import { Controller, Get, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import { upsertSettingSchema } from './settings.dto';

// Keys matching this pattern are considered sensitive and must NEVER be stored in
// site_settings. Store third-party API keys/secrets in email_providers/cdn_providers
// (which are auth-guarded) instead. Public reads of sensitive keys are rejected below.
const SENSITIVE_KEY = /secret|password|passwd|token|api[_-]?key|private|credential|client[_-]?secret/i;

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  // Listing all settings is an admin operation
  @UseGuards(JwtOrApiKeyGuard)
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  // Single-key reads: public for non-sensitive keys (site config), blocked for sensitive
  @Get(':key')
  async findOne(@Param('key') key: string) {
    if (SENSITIVE_KEY.test(key)) {
      throw new HttpException(
        'Forbidden: sensitive setting. Use authenticated GET /api/settings to list.',
        HttpStatus.FORBIDDEN,
      );
    }
    const s = await this.service.findOne(key);
    if (!s) throw new HttpException('Setting not found', HttpStatus.NOT_FOUND);
    return s;
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Put(':key')
  async upsert(@Param('key') key: string, @Body() body: unknown) {
    const parsed = upsertSettingSchema.safeParse({ key, value: (body as { value?: unknown })?.value ?? body });
    if (!parsed.success) throw new HttpException({ error: 'Invalid setting', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.upsert(parsed.data.key, parsed.data.value);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Delete(':key')
  async remove(@Param('key') key: string) {
    return this.service.remove(key);
  }
}
