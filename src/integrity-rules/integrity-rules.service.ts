import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegrityRulesHistorydto, IntegrityRulesRegisterdto } from './dto/integrity_rules_register.dto';
import { IntegrityRuleDeleteInput } from './inputs/integrity_rules_delete.input';
import { IntegrityRuleHistoryInput, IntegrityRuleRegisterInput } from './inputs/integrity_rules_register.input';

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
        return [];
    }

    async registerHistoryRule( irhi: IntegrityRuleHistoryInput): Promise<IntegrityRulesHistorydto> {
        try {
            console.log(irhi);
            const HistoryRule = new this.historyRules(irhi,  { $push: { children: irhi.children } },
                { new: true });
                console.log(HistoryRule);
            return await HistoryRule.save();
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}
