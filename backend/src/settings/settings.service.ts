import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
  }

  findOne(key: string) {
    return this.prisma.siteSetting.findUnique({ where: { key } });
  }

  async upsert(key: string, value: unknown) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: value as never },
      update: { value: value as never },
    });
  }

  async remove(key: string) {
    return this.prisma.siteSetting.delete({ where: { key } });
  }
}
