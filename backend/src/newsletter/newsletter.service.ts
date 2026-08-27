import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NewsletterService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}
  async subscribe(email: string, ip?: string) {
    try {
      const row = await this.prisma.newsletter.create({ data: { email: email.toLowerCase(), ip } });
      // welcome email via configured provider
      try {
        await this.emailService.enqueue({
          to: email.toLowerCase(),
          subject: 'Welcome to FloraDecora — monthly garden notes',
          body: `<p>Thanks for subscribing! You will receive monthly garden notes, irrigation tips and project before/afters.</p><p>— FloraDecora, Al Ain</p>`,
          template: 'newsletter_welcome',
        });
      } catch {}
      return row;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('Unique constraint')) throw new HttpException('Already subscribed', HttpStatus.CONFLICT);
      throw e;
    }
  }
  findAll() { return this.prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' } }); }
  remove(id: string) { return this.prisma.newsletter.delete({ where: { id } }); }
}
