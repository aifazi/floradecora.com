import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}
  async subscribe(email: string, ip?: string) {
    try {
      return await this.prisma.newsletter.create({ data: { email: email.toLowerCase(), ip } });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('Unique constraint')) throw new HttpException('Already subscribed', HttpStatus.CONFLICT);
      throw e;
    }
  }
  findAll() { return this.prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' } }); }
}
