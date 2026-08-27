import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  findAll(publishedOnly = true, query?: { take?: number; skip?: number }) {
    const take = query?.take ? Math.min(Math.max(query.take, 1), 100) : undefined;
    const skip = query?.skip ? Math.max(query.skip, 0) : undefined;
    return this.prisma.post.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }

  findOne(slug: string) {
    return this.prisma.post.findUnique({ where: { slug } });
  }

  findById(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  update(id: string, data: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
