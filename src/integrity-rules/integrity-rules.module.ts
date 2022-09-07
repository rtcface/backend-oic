import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrityRulesResolver } from './integrity-rules.resolver';
import { IntegrityRulesService } from './integrity-rules.service';
import { HistoriRulesSchema, IntegrityRuleSchema } from './schemas/integrity_rules.schema';

@Module({
  imports: [MongooseModule.forFeature(
   [ 
    { 
      name:'IntegrityRule',
      schema: IntegrityRuleSchema
    },
    { 
      name:'HistoriRules',
      schema: HistoriRulesSchema
    },
  ]
  )],
  providers: [IntegrityRulesResolver, IntegrityRulesService],
  exports: [IntegrityRulesService]
})
export class IntegrityRulesModule {}
