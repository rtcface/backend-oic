import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeEthicsResolver } from './code-ethics.resolver';
import { CodeEthicsService } from './code-ethics.service';
import { CodeEthicsSchema } from './schemas/code_ethics.schema';

@Module({
  imports: [ MongooseModule.forFeature([{name: 'CodeEthics', schema:CodeEthicsSchema}]) ],
  providers: [CodeEthicsResolver, CodeEthicsService],
  exports: [CodeEthicsService]
})
export class CodeEthicsModule {}
  