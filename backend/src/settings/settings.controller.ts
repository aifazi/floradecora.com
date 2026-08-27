import { Controller, Get, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import { upsertSettingSchema } from './settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
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
