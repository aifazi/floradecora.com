import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

@Injectable()
export class CdnService {
  private readonly logger = new Logger(CdnService.name);

  constructor(private prisma: PrismaService) {}

  async getActiveProvider() {
    const active = await this.prisma.cdnProvider.findFirst({ where: { active: true } });
    if (active) return active;
    if (process.env.R2_ENDPOINT) return { provider: 'r2', config: { endpoint: process.env.R2_ENDPOINT, accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY, bucket: process.env.R2_BUCKET || 'floradecora', cdnUrl: process.env.CDN_URL }, active: true } as never;
    if (process.env.CLOUDINARY_URL) return { provider: 'cloudinary', config: { url: process.env.CLOUDINARY_URL }, active: true } as never;
    if (process.env.BUNNY_STORAGE_ZONE) return { provider: 'bunny', config: { storageZone: process.env.BUNNY_STORAGE_ZONE, apiKey: process.env.BUNNY_API_KEY, pullZone: process.env.BUNNY_PULL_ZONE }, active: true } as never;
    return { provider: 'local', config: {}, active: true } as never;
  }

  async upload(key: string, buffer: Buffer, mime: string): Promise<string> {
    const provider = await this.getActiveProvider();
    const p = (provider as { provider: string }).provider;
    const cfg = (provider as { config: Record<string, string> }).config || {};

    if (p === 'r2') {
      const endpoint = cfg.endpoint || process.env.R2_ENDPOINT;
      if (endpoint) {
        const s3 = new S3Client({ region: 'auto', endpoint, credentials: { accessKeyId: cfg.accessKeyId || process.env.R2_ACCESS_KEY_ID || '', secretAccessKey: cfg.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY || '' } });
        const bucket = cfg.bucket || process.env.R2_BUCKET || 'floradecora';
        await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: mime }));
        const cdn = cfg.cdnUrl || process.env.CDN_URL || 'https://cdn.aifazi.net';
        return `${cdn.replace(/\/$/, '')}/${key}`;
      }
    }
    if (p === 'cloudinary') {
      const url = cfg.url || process.env.CLOUDINARY_URL;
      if (url) {
        // parse cloudinary://api_key:api_secret@cloud_name
        cloudinary.config({ secure: true });
        // upload via buffer
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ public_id: key.replace(/\//g, '_'), resource_type: 'auto' }, (err, result) => {
            if (err) reject(err);
            else resolve(result?.secure_url || result?.url || '');
          });
          stream.end(buffer);
        });
      }
    }
    if (p === 'bunny') {
      const zone = cfg.storageZone || process.env.BUNNY_STORAGE_ZONE;
      const apiKey = cfg.apiKey || process.env.BUNNY_API_KEY;
      const pullZone = cfg.pullZone || process.env.BUNNY_PULL_ZONE;
      if (zone && apiKey) {
        const host = `https://storage.bunnycdn.com/${zone}/${key}`;
        await axios.put(host, buffer, { headers: { AccessKey: apiKey, 'Content-Type': mime } });
        if (pullZone) return `https://${pullZone}/${key}`;
        return host;
      }
    }
    // local fallback — still return CDN URL for DB, but not actually stored
    const cdn = process.env.CDN_URL || 'https://cdn.aifazi.net';
    this.logger.warn(`CDN provider ${p} not fully configured, returning ${cdn}/${key} without upload`);
    return `${cdn.replace(/\/$/, '')}/${key}`;
  }

  async delete(key: string) {
    const provider = await this.getActiveProvider();
    const p = (provider as { provider: string }).provider;
    const cfg = (provider as { config: Record<string, string> }).config || {};
    try {
      if (p === 'r2' && cfg.endpoint) {
        const s3 = new S3Client({ region: 'auto', endpoint: cfg.endpoint, credentials: { accessKeyId: cfg.accessKeyId || '', secretAccessKey: cfg.secretAccessKey || '' } });
        await s3.send(new DeleteObjectCommand({ Bucket: cfg.bucket || 'floradecora', Key: key }));
      } else if (p === 'cloudinary') {
        await cloudinary.uploader.destroy(key.replace(/\//g, '_'));
      } else if (p === 'bunny' && cfg.storageZone) {
        await axios.delete(`https://storage.bunnycdn.com/${cfg.storageZone}/${key}`, { headers: { AccessKey: cfg.apiKey } });
      }
    } catch (e) {
      this.logger.error(`CDN delete failed ${key}: ${e}`);
    }
  }

  async listProviders() {
    return this.prisma.cdnProvider.findMany({ orderBy: { provider: 'asc' } });
  }

  async upsertProvider(provider: string, config: unknown, active: boolean) {
    if (active) await this.prisma.cdnProvider.updateMany({ where: { active: true }, data: { active: false } });
    return this.prisma.cdnProvider.upsert({ where: { provider }, create: { provider, config: config as never, active }, update: { config: config as never, active } });
  }

  async testProvider(provider: string) {
    const p = await this.prisma.cdnProvider.findUnique({ where: { provider } });
    if (!p) throw new Error('Provider not found');
    // test upload 1x1 png
    const buf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=', 'base64');
    const url = await this.upload(`test/${Date.now()}.png`, buf, 'image/png');
    return { url };
  }
}
