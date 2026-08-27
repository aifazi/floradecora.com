import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './contact.dto';
import { EmailService } from '../email/email.service';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateContactDto, ip?: string) {
    if (dto.botcheck) return { success: true }; // honeypot
    const contact = await this.prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone || null,
        projectType: dto.projectType || null,
        message: dto.message,
        ip,
      },
    });
    // Queue email via configured provider — escape HTML to prevent stored XSS
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_TO || 'info@floradecora.com';
    try {
      await this.emailService.enqueue({
        to: adminEmail,
        subject: `New inquiry from ${escapeHtml(dto.name)} — floradecora.com`,
        body: `<p><strong>Name:</strong> ${escapeHtml(dto.name)}</p><p><strong>Email:</strong> ${escapeHtml(dto.email)}</p><p><strong>Phone:</strong> ${escapeHtml(dto.phone || '-')}</p><p><strong>Project:</strong> ${escapeHtml(dto.projectType || '-')}</p><p><strong>Message:</strong><br/>${escapeHtml(dto.message).replace(/\n/g, '<br/>')}</p><p><strong>IP:</strong> ${escapeHtml(ip || 'unknown')}</p>`,
        template: 'contact',
        payload: dto as never,
      });
    } catch {}
    // Keep Web3Forms as optional fallback if still configured and no email provider active
    if (process.env.WEB3FORMS_KEY) {
      try {
        const hasProvider = await this.emailService.getActiveProvider();
        if (!hasProvider) {
          const fd = new FormData();
          fd.append('access_key', process.env.WEB3FORMS_KEY);
          fd.append('name', dto.name);
          fd.append('email', dto.email);
          fd.append('message', dto.message);
          await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
        }
      } catch {}
    }
    return contact;
  }

  findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.contact.update({ where: { id }, data: { status: status as never } });
  }

  remove(id: string) {
    return this.prisma.contact.delete({ where: { id } });
  }
}
