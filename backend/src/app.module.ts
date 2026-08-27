import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ProjectModule } from './project/project.module';
import { MediaModule } from './media/media.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CmsServicesModule } from './cms-services/services.module';
import { SettingsModule } from './settings/settings.module';
import { EmailModule } from './email/email.module';
import { CdnModule } from './cdn/cdn.module';
import { EmailTemplatesModule } from './email-templates/email-templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    PrismaModule,
    AuthModule,
    ContactModule,
    NewsletterModule,
    ProjectModule,
    PostsModule,
    CmsServicesModule,
    SettingsModule,
    EmailModule,
    EmailTemplatesModule,
    CdnModule,
    MediaModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
