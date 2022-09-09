import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegrityRulesHistorydto, IntegrityRulesRegisterdto } from './dto/integrity_rules_register.dto';
import { IntegrityRuleDeleteInput } from './inputs/integrity_rules_delete.input';
import { IntegrityRuleRegisterInput } from './inputs/integrity_rules_register.input';

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

}
