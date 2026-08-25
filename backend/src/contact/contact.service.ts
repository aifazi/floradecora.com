import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

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
    // Optionally forward to Web3Forms if WEB3FORMS_KEY set
    if (process.env.WEB3FORMS_KEY) {
      try {
        const fd = new FormData();
        fd.append('access_key', process.env.WEB3FORMS_KEY);
        fd.append('name', dto.name);
        fd.append('email', dto.email);
        fd.append('message', dto.message);
        await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      } catch {}
    }
    return contact;
  }

  findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
