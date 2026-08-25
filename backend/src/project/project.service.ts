import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } }); }
  findOne(slug: string) { return this.prisma.project.findUnique({ where: { slug } }); }
  create(data: { slug: string; title: string; type: string; year: string; location: string; area: string; client: string; img: string; gallery: string[]; description: string; services: string[]; featured?: boolean; built?: boolean }) {
    return this.prisma.project.create({ data });
  }
}
