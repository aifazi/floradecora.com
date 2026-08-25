import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class MediaService {
  private s3: S3Client;
  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }
  async upload(key: string, buffer: Buffer, contentType: string) {
    const bucket = process.env.R2_BUCKET || 'floradecora';
    await this.s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }));
    const cdn = process.env.CDN_URL || 'https://cdn.aifazi.net';
    return `${cdn}/${key}`;
  }
}
