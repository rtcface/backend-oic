import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver,Query, } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards';
import { IntegrityRulesHistorydto, IntegrityRulesRegisterdto } from './dto/integrity_rules_register.dto';
import { HistoryRuleByEnteInput } from './inputs/integrity_rules_query.input';
import { IntegrityRuleHistoryInput, IntegrityRuleRegisterInput } from './inputs/integrity_rules_register.input';
import { IntegrityRuleHistoryUpdateInput } from './inputs/integrity_rules_update.input';
import { IntegrityRulesService } from './integrity-rules.service';

@Resolver()
export class IntegrityRulesResolver {
    constructor( private readonly irs:IntegrityRulesService ) {}

      @UseGuards(GqlAuthGuard)
       @Mutation( () => IntegrityRulesRegisterdto )
       async addIntegrityRule( 
         @Args('input') irri: IntegrityRuleRegisterInput 
         ){
           return await this.irs.registerIntegrityRule(irri);
       }

       @UseGuards(GqlAuthGuard)
       @Mutation( () => IntegrityRulesHistorydto )
       async registerHistoryRules( 
         @Args('input') irhi: IntegrityRuleHistoryInput 
         ){
           
           return await this.irs.registerHistoryRule(irhi);
       }


       @UseGuards(GqlAuthGuard)
       @Mutation( () => IntegrityRulesHistorydto )
       async updateHistoryRules( 
         @Args('input') irhui: IntegrityRuleHistoryUpdateInput 
         ){
           
           return await this.irs.updateHistoryRule(irhui);
       }


       @UseGuards( GqlAuthGuard )
       @Query( () => [ IntegrityRulesRegisterdto ] )
       async getIntegrityRules(){
        return await this.irs.getIntegrityRulus();
       }

      
       @Query( () => [ IntegrityRulesHistorydto ] )
       async getHistoryIntegrityRulesByEnte(@Args('input')  hrbei:HistoryRuleByEnteInput  ){

        return await this.irs.getHistoryRulesByEnte(hrbei);
       
      }

    
}
