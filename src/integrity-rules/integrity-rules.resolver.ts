import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IntegrityRulesRegisterdto } from './dto/integrity_rules_register.dto';
import { IntegrityRuleRegisterInput } from './inputs/integrity_rules_register.input';
import { IntegrityRulesService } from './integrity-rules.service';

@Resolver()
export class IntegrityRulesResolver {


    constructor( private readonly irs:IntegrityRulesService ) {}

     //@UseGuards(GqlAuthGuard)
    //  @Mutation( () => IntegrityRulesRegisterdto )
    //  async addIntegrityRule(@Args('input') irri: IntegrityRuleRegisterInput ) {
    //      return await this.irs.registerIntegrityRule(irri);
    //  }
}
