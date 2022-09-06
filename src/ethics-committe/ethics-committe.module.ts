import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EthicsCommitteResolver } from './ethics-committe.resolver';
import { EthicsCommitteService } from './ethics-committe.service';
import { CommitteSchema } from './schemas/ethics_committe.schema';

@Module({
  imports: [ MongooseModule.forFeature([{ name: 'Committe', schema: CommitteSchema }])],
  providers: [EthicsCommitteResolver, EthicsCommitteService],
  exports: [EthicsCommitteService]
})
export class EthicsCommitteModule {}
