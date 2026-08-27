import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ProjectService } from './project.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import { createProjectSchema } from './project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':slug') findOne(@Param('slug') slug: string) { return this.service.findOne(slug); }
  @UseGuards(JwtOrApiKeyGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post() create(@Body() body: unknown) {
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid project input', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.create(parsed.data);
  }
  @UseGuards(JwtOrApiKeyGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = createProjectSchema.partial().safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid project', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.update(id, parsed.data);
  }
  @UseGuards(JwtOrApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
