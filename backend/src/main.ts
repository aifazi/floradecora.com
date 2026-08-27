import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as helmetModule from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET is required and must be >=32 chars (generate: openssl rand -base64 32)');
  }
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const helmet = ((helmetModule as unknown as { default?: (opts?: Record<string, unknown>) => unknown }).default) || (helmetModule as unknown as (opts?: Record<string, unknown>) => unknown);
  // CSP is handled by Next.js (next.config.mjs headers) for the frontend; disable here to avoid double CSP that breaks inline scripts.
  // COEP disabled because R2/CDN images are cross-origin without CORP headers.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }) as never);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.set('trust proxy', 1);
  const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) || [
    'https://floradecora.com',
    'https://www.floradecora.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on http://localhost:${port}/api`);
}
bootstrap();
