import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GraficoDto } from './dto/grafico.dto';
import {
  IntegrityRulesHistorydto,
  IntegrityRulesRegisterdto,
} from './dto/integrity_rules_register.dto';
import { IntegrityRuleDeleteInput } from './inputs/integrity_rules_delete.input';
import { HistoryRuleByEnteInput } from './inputs/integrity_rules_query.input';
import {
  IntegrityRuleHistoryInput,
  IntegrityRuleRegisterInput,
} from './inputs/integrity_rules_register.input';
import { IntegrityRuleHistoryUpdateInput } from './inputs/integrity_rules_update.input';
import { DataHistory, Data } from './interfaces/graficas';

@Injectable()
export class IntegrityRulesService {
  constructor(
    @InjectModel('IntegrityRule')
    private readonly integrityRule: Model<IntegrityRulesRegisterdto>,
    @InjectModel('HistoryRules')
    private readonly historyRules: Model<IntegrityRulesHistorydto>,
  ) {}

  async registerIntegrityRule(
    irri: IntegrityRuleRegisterInput,
  ): Promise<IntegrityRulesRegisterdto> {
    try {
      const createdRule = new this.integrityRule(irri);
      return await createdRule.save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async inacviteIntegrityRule(
    inactive: IntegrityRuleDeleteInput,
  ): Promise<IntegrityRulesRegisterdto> {
    return await this.integrityRule
      .findByIdAndUpdate(inactive.id, { status: 'inactive' }, { new: true })
      .exec();
  }

  async getIntegrityRulus(): Promise<IntegrityRulesRegisterdto[] | []> {
    try {
      return await this.integrityRule.find({ status: 'active' }).exec();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async registerHistoryRule(
    irhi: IntegrityRuleHistoryInput,
  ): Promise<IntegrityRulesHistorydto> {
    try {
      const HistoryRule = new this.historyRules(irhi);
      return await HistoryRule.save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateHistoryRule(
    irhui: IntegrityRuleHistoryUpdateInput,
  ): Promise<IntegrityRulesHistorydto> {
    try {
      const { id, ...data } = irhui;
      return await this.historyRules
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getHistoryRulesByEnte(
    input: HistoryRuleByEnteInput,
  ): Promise<IntegrityRulesHistorydto[]> {
    try {
      input.status = 'active';
      return await this.historyRules.find(input).exec();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getGraficosService(): Promise<GraficoDto> {
    try {
      const lab: string[] = [];
      const por: number[] = []; 
      const res = await this.historyRules.aggregate<DataHistory>([
        {
          $project: {
            ente_publico: '$ente_publico',
            porcentaje: {
              $multiply: [
                {
                  $divide: [
                    {
                      $sum: [
                        { $toInt: '$p1' },
                        { $toInt: '$p2' },
                        { $toInt: '$p3' },
                        { $toInt: '$p4' },
                        { $toInt: '$p5' },
                        { $toInt: '$p6' },
                        { $toInt: '$p7' },
                        { $toInt: '$p8' },
                        { $toInt: '$p9' },
                        { $toInt: '$p10' },
                        { $toInt: '$p11' },
                        { $toInt: '$p12' },
                        { $toInt: '$p13' },
                        { $toInt: '$p14' },
                        { $toInt: '$p15' },
                        { $toInt: '$p16' },
                      ],
                    },
                    16,
                  ],
                },
                100,
              ],
            },
          },
        },
      ]);
      await this.historyRules.populate(res, {
        path: 'ente_publico',
      });
      res.map((res) => {
        lab.push(res.ente_publico.nombre_ente);
        por.push(res.porcentaje);        
      });

      const salida:Data = {
       
          labels: lab,
          datasets: [
              {
              label: 'Porcentaje de avance',
              backgroundColor: [
                '#EC407A',
                '#AB47BC',
                '#42A5F5',
                '#7E57C2',
                '#66BB6A',
                '#FFCA28',
                '#26A69A',
              ],
              data:por
            },
          ],
        
      };

      // console.log(salida);

      //dataHistory.map
      //  console.log('data>',data)
      //

      //    console.log(res);

      // return salida;
      return salida;

      //.find({status:'active'}).exec();
    } catch (error) {
      console.log(error);
      return {
        datasets:null,
        labels:null
      };
    }
  }
}
