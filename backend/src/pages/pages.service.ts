import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePageDto, UpdatePageDto } from "./pages.dto";

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  findAll(publishedOnly = true, query?: { take?: number; skip?: number }) {
    const take = query?.take ? Math.min(Math.max(query.take, 1), 100) : undefined;
    const skip = query?.skip ? Math.max(query.skip, 0) : undefined;
    return this.prisma.page.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  }

  findOne(slug: string) {
    return this.prisma.page.findUnique({ where: { slug } });
  }

  findById(id: string) {
    return this.prisma.page.findUnique({ where: { id } });
  }

  create(data: CreatePageDto) {
    return this.prisma.page.create({ data: data as any });
  }

  update(id: string, data: UpdatePageDto) {
    return this.prisma.page.update({ where: { id }, data: data as any });
  }

  remove(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }
}