import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CdnService } from '../cdn/cdn.service';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private cdnService: CdnService,
  ) {}

  async upload(key: string, buffer: Buffer, contentType: string) {
    const url = await this.cdnService.upload(key, buffer, contentType);
    try {
      await this.prisma.media.upsert({
        where: { key },
        create: { key, url, mime: contentType, size: buffer.length },
        update: { url, mime: contentType, size: buffer.length },
      });
    } catch {}
    return url;
  }

  findAll(query?: { take?: number; skip?: number }) {
    const take = Math.min(Math.max(query?.take || 50, 1), 100);
    const skip = Math.max(query?.skip || 0, 0);
    return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take, skip });
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new Error('Media not found');
    await this.cdnService.delete(media.key);
    return this.prisma.media.delete({ where: { id } });
  }
}
