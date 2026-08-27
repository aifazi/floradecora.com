import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus, Query } from '@nestjs/common';
import { CmsServicesService } from './services.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import { createServiceSchema, updateServiceSchema } from './services.dto';

@Controller('services')
export class CmsServicesController {
  constructor(private readonly service: CmsServicesService) {}

  @Get()
  async findAll(@Query('all') all?: string) {
    const enabledOnly = all !== 'true';
    return this.service.findAll(enabledOnly);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const s = await this.service.findOne(slug);
    if (!s) throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    return s;
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Post()
  async create(@Body() body: unknown) {
    const parsed = createServiceSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid service', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.create(parsed.data);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid service', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.update(id, parsed.data);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
