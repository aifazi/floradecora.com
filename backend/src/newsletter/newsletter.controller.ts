import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { z } from 'zod';
import { NewsletterService } from './newsletter.service';

const schema = z.object({ email: z.string().email() });

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}
  @Post()
  async subscribe(@Body() body: unknown, @Req() req: Request) {
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new Error('Invalid email');
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    return this.service.subscribe(parsed.data.email, ip);
  }
  @Get()
  findAll() { return this.service.findAll(); }
}
