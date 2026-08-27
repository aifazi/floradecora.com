import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';

@Injectable()
export class CmsServicesService {
  constructor(private prisma: PrismaService) {}

  findAll(enabledOnly = true) {
    return this.prisma.service.findMany({
      where: enabledOnly ? { enabled: true } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  findOne(slug: string) {
    return this.prisma.service.findUnique({ where: { slug } });
  }

  findById(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  create(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  update(id: string, data: UpdateServiceDto) {
    return this.prisma.service.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }
}
