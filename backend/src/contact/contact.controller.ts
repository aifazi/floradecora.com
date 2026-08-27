import { Controller, Post, Get, Patch, Delete, Body, Req, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { ContactService } from './contact.service';
import { createContactSchema } from './contact.dto';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import { EmailService } from '../email/email.service';
import { EmailTemplatesService } from '../email-templates/email-templates.service';
import { z } from 'zod';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly emailService: EmailService,
    private readonly templatesService: EmailTemplatesService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  async create(@Body() body: unknown, @Req() req: Request) {
    const parsed = createContactSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid input', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    return this.contactService.create(parsed.data, ip);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    if (!['new', 'contacted', 'won', 'lost'].includes(body.status)) throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    return this.contactService.updateStatus(id, body.status);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Post(':id/reply')
  async reply(@Param('id') id: string, @Body() body: unknown) {
    const schema = z.object({
      subject: z.string().min(2).max(300),
      body: z.string().min(10).max(10000),
      templateKey: z.string().optional(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid reply', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);

    const contact = await this.contactService.findById(id);
    if (!contact) throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    let subject = parsed.data.subject;
    let html = parsed.data.body;

    // if templateKey provided, render template with vars
    if (parsed.data.templateKey) {
      const tmpl = await this.templatesService.findOne(parsed.data.templateKey);
      if (tmpl) {
        subject = this.templatesService.render(tmpl.subject, { name: contact.name, email: contact.email, message: contact.message });
        html = this.templatesService.render(tmpl.body, { name: contact.name, email: contact.email, message: contact.message, subject: parsed.data.subject, body: parsed.data.body });
      }
    }

    // allow {{name}} etc in custom body even without template
    html = this.templatesService.render(html, { name: contact.name, email: contact.email, message: contact.message });

    await this.emailService.enqueue({
      to: contact.email,
      subject,
      body: html,
      template: parsed.data.templateKey || 'inquiry_reply',
      payload: { contactId: id, contactEmail: contact.email } as never,
    });

    // auto update status to contacted if was new
    if (contact.status === 'new') {
      await this.contactService.updateStatus(id, 'contacted');
    }

    return { success: true };
  }
}
