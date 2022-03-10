import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EntePublicoSchema } from './schemas';
import { EnteService } from './ente.service';
import { EnteResolver } from './ente.resolver';

@Module({
  imports: [ MongooseModule.forFeature([{name: 'EntePublico', schema:EntePublicoSchema}]) ],
  providers: [EnteService, EnteResolver],
  exports: [EnteService]
})
export class EnteModule {}
