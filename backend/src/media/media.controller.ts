import { Controller, Get, Post, Delete, Param, Query, UseInterceptors, UploadedFile, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-apikey.guard';
import type { Express } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(@Query('take') take?: string, @Query('skip') skip?: string) {
    return this.mediaService.findAll({ take: take ? parseInt(take, 10) : undefined, skip: skip ? parseInt(skip, 10) : undefined });
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (/^image\/(jpeg|png|webp|avif|gif)$/.test(file.mimetype)) cb(null, true);
        else cb(new HttpException('Only image uploads allowed', HttpStatus.BAD_REQUEST) as unknown as Error, false);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
    const key = `media/assest/${Date.now()}-${safeName}`;
    const url = await this.mediaService.upload(key, file.buffer, file.mimetype);
    return { url, key };
  }

  @UseGuards(JwtOrApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
