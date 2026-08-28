import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus, Query } from "@nestjs/common";
import { PagesService } from "./pages.service";
import { JwtOrApiKeyGuard } from "../auth/guards/jwt-or-apikey.guard";
import { createPageSchema, updatePageSchema } from "./pages.dto";
import { Throttle } from "@nestjs/throttler";

@Controller("pages")
export class PagesController {
  constructor(private readonly service: PagesService) {}

  @Get()
  async findAll(@Query("all") all?: string, @Query("take") take?: string, @Query("skip") skip?: string) {
    const publishedOnly = all !== "true";
    return this.service.findAll(publishedOnly, {
      take: take ? parseInt(take, 10) : undefined,
      skip: skip ? parseInt(skip, 10) : undefined,
    });
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const page = await this.service.findOne(slug);
    if (!page) throw new HttpException("Page not found", HttpStatus.NOT_FOUND);
    return page;
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post()
  async create(@Body() body: unknown) {
    const parsed = createPageSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: "Invalid page", issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.create(parsed.data);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Put(":id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const parsed = updatePageSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: "Invalid page", issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.update(id, parsed.data);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}