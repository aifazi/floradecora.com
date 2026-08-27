import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpException, HttpStatus, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import { createPostSchema, updatePostSchema } from './posts.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get()
  async findAll(@Query('all') all?: string) {
    const publishedOnly = all !== 'true';
    return this.service.findAll(publishedOnly);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const post = await this.service.findOne(slug);
    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    return post;
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post()
  async create(@Body() body: unknown) {
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid post', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.create(parsed.data);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid post', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    return this.service.update(id, parsed.data);
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
