import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as helmetModule from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const helmet = (helmetModule as unknown as { default?: typeof helmetModule }).default || helmetModule;
  app.use((helmet as unknown as () => unknown)());
  app.use(cookieParser());
  // ValidationPipe requires class-validator; keep permissive for now to avoid crash if not installed
  try {
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  } catch {
    console.warn('ValidationPipe not enabled - class-validator missing');
  }
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
