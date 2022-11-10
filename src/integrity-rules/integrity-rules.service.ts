import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegrityRulesHistorydto, IntegrityRulesRegisterdto } from './dto/integrity_rules_register.dto';
import { IntegrityRuleDeleteInput } from './inputs/integrity_rules_delete.input';
import { HistoryRuleByEnteInput } from './inputs/integrity_rules_query.input';
import { IntegrityRuleHistoryInput, IntegrityRuleRegisterInput } from './inputs/integrity_rules_register.input';
import { IntegrityRuleHistoryUpdateInput } from './inputs/integrity_rules_update.input';

@Injectable()
export class IntegrityRulesService {

    constructor(
        @InjectModel( 'IntegrityRule' ) private readonly integrityRule: Model<IntegrityRulesRegisterdto>,
        @InjectModel( 'HistoryRules' ) private readonly historyRules: Model<IntegrityRulesHistorydto>
    ) {}

    async registerIntegrityRule( irri: IntegrityRuleRegisterInput): Promise<IntegrityRulesRegisterdto> {
        try {
            const createdRule = new this.integrityRule(irri);
            return await createdRule.save();
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async inacviteIntegrityRule(inactive: IntegrityRuleDeleteInput): Promise<IntegrityRulesRegisterdto> {  
        return await this.integrityRule.findByIdAndUpdate(inactive.id, { status:'inactive' }, { new: true }).exec();
    }

    async getIntegrityRulus(): Promise<IntegrityRulesRegisterdto[] | []>{
        try {
            return await this.integrityRule.find({ status:'active' }).exec();          
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async registerHistoryRule( irhi: IntegrityRuleHistoryInput): Promise<IntegrityRulesHistorydto> {
        try {           
            const HistoryRule = new this.historyRules(irhi);           
            return await HistoryRule.save();
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async updateHistoryRule( irhui: IntegrityRuleHistoryUpdateInput): Promise<IntegrityRulesHistorydto>{
        try {
            const { id, ...data } = irhui; 
            return await this.historyRules.findByIdAndUpdate(id, data, { new: true }).exec();            
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    
    async getHistoryRulesByEnte(input: HistoryRuleByEnteInput ): Promise<IntegrityRulesHistorydto[]> {
        try {
            input.status='active';
            return await this.historyRules.find(input).exec();          
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    

}
