import { Module } from '@nestjs/common';
import { CmsServicesService } from './services.service';
import { CmsServicesController } from './services.controller';

@Module({ providers: [CmsServicesService], controllers: [CmsServicesController] })
export class CmsServicesModule {}
