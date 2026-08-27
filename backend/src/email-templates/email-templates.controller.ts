import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import { createTemplateSchema, updateTemplateSchema } from './email-templates.dto';

@Controller('email/templates')
@UseGuards(JwtOrApiKeyGuard)
export class EmailTemplatesController {
  constructor(private readonly service: EmailTemplatesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
    const t = await this.service.findOne(key);
    if (!t) throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    return t;
  }

  @Post()
  async create(@Body() body: unknown) {
    const parsed = createTemplateSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid template', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.create(parsed.data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = updateTemplateSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid template', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.update(id, parsed.data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
