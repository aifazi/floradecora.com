import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } }); }
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
