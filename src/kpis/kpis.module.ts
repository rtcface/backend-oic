import { Module } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { KpisResolver } from './kpis.resolver';

@Module({
  providers: [KpisService, KpisResolver]
})
export class KpisModule {}
