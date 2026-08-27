import { Global, Module } from '@nestjs/common';
import { CdnService } from './cdn.service';
import { CdnController } from './cdn.controller';

@Global()
@Module({ providers: [CdnService], controllers: [CdnController], exports: [CdnService] })
export class CdnModule {}
