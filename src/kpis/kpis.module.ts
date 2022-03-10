import { Module } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { KpisResolver } from './kpis.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { KpisSchema } from './schemas';

@Module({
  imports: [ MongooseModule.forFeature([{name: 'Kpis', schema:KpisSchema}]) ],
  providers: [KpisService, KpisResolver],
  exports: [KpisService]
})
export class KpisModule {}
