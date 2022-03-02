import { Module } from '@nestjs/common';
import { EnteService } from './ente.service';
import { EnteResolver } from './ente.resolver';

@Module({
  providers: [EnteService, EnteResolver]
})
export class EnteModule {}
