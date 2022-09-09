import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrityRulesResolver } from './integrity-rules.resolver';
import { IntegrityRulesService } from './integrity-rules.service';
import { HistoryRulesSchema, IntegrityRuleSchema } from './schemas/integrity_rules.schema';

@Module({
  imports: [MongooseModule.forFeature(
   [ 
    { 
      name:'IntegrityRule',
      schema: IntegrityRuleSchema
    },
    { 
      name:'HistoryRules',
      schema: HistoryRulesSchema
    },
  ]
  )],
  providers: [IntegrityRulesResolver, IntegrityRulesService],
  exports: [IntegrityRulesService]
})
export class IntegrityRulesModule {}
