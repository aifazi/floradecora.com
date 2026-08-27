import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  findAll(query?: { take?: number; skip?: number; featured?: boolean }) {
    const take = query?.take ? Math.min(Math.max(query.take, 1), 100) : undefined;
    const skip = query?.skip ? Math.max(query.skip, 0) : undefined;
    const where = query?.featured !== undefined ? { featured: query.featured } : undefined;
    return this.prisma.project.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip });
  }
  findOne(slug: string) { return this.prisma.project.findUnique({ where: { slug } }); }
  findById(id: string) { return this.prisma.project.findUnique({ where: { id } }); }
  create(data: CreateProjectDto) {
    return this.prisma.project.create({ data });
  }
  update(id: string, data: Partial<CreateProjectDto>) {
    return this.prisma.project.update({ where: { id }, data });
  }
  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
