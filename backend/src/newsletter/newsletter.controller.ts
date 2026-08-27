import { Controller, Post, Get, Delete, Body, Req, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { z } from 'zod';
import { NewsletterService } from './newsletter.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';

const schema = z.object({ email: z.string().email().max(120) });

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  async subscribe(@Body() body: unknown, @Req() req: Request) {
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid email', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    return this.service.subscribe(parsed.data.email, ip);
  }
  @UseGuards(JwtOrApiKeyGuard)
  @Get()
  findAll() { return this.service.findAll(); }
  @UseGuards(JwtOrApiKeyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
