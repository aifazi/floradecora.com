import { Controller, Post, Get, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import type { Request } from 'express';
import { ContactService } from './contact.service';
import { createContactSchema } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() body: unknown, @Req() req: Request) {
    const parsed = createContactSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid input', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    return this.contactService.create(parsed.data, ip);
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }
}
