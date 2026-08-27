import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './email-templates.dto';

@Injectable()
export class EmailTemplatesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.emailTemplate.findMany({ orderBy: { key: 'asc' } });
  }

  findOne(key: string) {
    return this.prisma.emailTemplate.findUnique({ where: { key } });
  }

  findById(id: string) {
    return this.prisma.emailTemplate.findUnique({ where: { id } });
  }

  create(data: CreateTemplateDto) {
    return this.prisma.emailTemplate.create({ data });
  }

  update(id: string, data: UpdateTemplateDto) {
    return this.prisma.emailTemplate.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.emailTemplate.delete({ where: { id } });
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  render(body: string, vars: Record<string, string>): string {
    let out = body;
    for (const [k, v] of Object.entries(vars)) {
      const esc = this.escapeHtml(v);
      out = out.replaceAll(`{{${k}}}`, esc).replaceAll(`{{ ${k} }}`, esc);
    }
    return out;
  }
}
