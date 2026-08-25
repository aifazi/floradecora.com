import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':slug') findOne(@Param('slug') slug: string) { return this.service.findOne(slug); }
  @Post() create(@Body() body: { slug: string; title: string; type: string; year: string; location: string; area: string; client: string; img: string; gallery: string[]; description: string; services: string[] }) {
    return this.service.create(body);
  }
}
