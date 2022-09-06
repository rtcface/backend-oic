import { Module } from '@nestjs/common';
import { IntegrityRulesResolver } from './integrity-rules.resolver';
import { IntegrityRulesService } from './integrity-rules.service';

@Module({
  providers: [IntegrityRulesResolver, IntegrityRulesService]
})
export class IntegrityRulesModule {}
