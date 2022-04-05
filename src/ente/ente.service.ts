import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlanWorkRegisterInput } from 'src/plan-work/inputs';
import { PlanWorkService } from 'src/plan-work/plan-work.service';
import { EnteRegisterDto } from './dto';
import { EnteQueryDto } from './dto';
import { EnterRegisterInput } from './inputs';
import { EnteUpdateInput } from './inputs';

@Injectable()
export class EnteService {
    

    constructor(
        private readonly pws:PlanWorkService,
        @InjectModel('EntePublico') private readonly enteModel: Model<EnteRegisterDto>
       
    ) {}

    async addEnte(inputCreateEnte: EnterRegisterInput): Promise<EnteRegisterDto> {
        const createdEnte = new this.enteModel(inputCreateEnte);
        const id_ente = createdEnte._id;
        //console.log("IdEnte>>>>>",id_ente);
        const item:PlanWorkRegisterInput = {
            ente_publico : id_ente,
            label : "Plan de trabajo",
            data : "Plan de trabajo"
        }

        
       // console.log("Item>>>>>",item);

        const save = await createdEnte.save();
        const planWork = await this.pws.addPlanWorkRoot(item);
        return save;
    }

    async cargaMasivaEnte(inputCreateEnte: EnterRegisterInput[]):
     Promise<EnteRegisterDto[]> {
        const entes = inputCreateEnte.map(ente => new this.enteModel(ente));

        if (entes.length > 0) {
            return await this.enteModel.insertMany(entes);
        }
    
        return [];
    }

    async getEnte(): Promise<EnteQueryDto[]> {
        return await this.enteModel.find({status:'active'}).exec();
    }

    async getEnteById(id: string): Promise<EnteQueryDto> {
        return await this.enteModel.findById(id).exec();
    }

    async updateEnte(id: string, inputUpdateEnte: EnteUpdateInput): Promise<EnteRegisterDto> {
        return await this.enteModel.findByIdAndUpdate(id, inputUpdateEnte, { new: true }).exec();
    }

    async inactivateEnte(id: string): Promise<EnteRegisterDto> {
        return await this.enteModel.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
    }

    async getEnteBySiglas(siglas: string): Promise<EnteQueryDto> {
        return await this.enteModel.findOne({ siglas: siglas }).exec();
    }

    async getEnteByName(name: string): Promise<EnteQueryDto[]> {
      
        const regex = new RegExp(name, 'i');
       
        return await this.enteModel.find({
        $or:[{nombre_ente:regex},{siglas_ente:regex}],
        $and:[{status:'active'}]        
    }).exec();
    }

}
