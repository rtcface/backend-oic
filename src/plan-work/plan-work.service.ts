import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { PlanWorkRegisterDto, PlanWorkQueryDto } from './dto';
import { PlanWorkRegisterInput } from './inputs';


@Injectable()
export class PlanWorkService {

    constructor(
        @InjectModel('PlanWorkGrandParent') private readonly planWorkModel: Model<PlanWorkRegisterDto>,
    ) {}   

    async addPlanWorkRoot(inputCreatePlanWork: PlanWorkRegisterInput): 
        Promise<PlanWorkRegisterDto> {
        const createdPlanWork = new this.planWorkModel(inputCreatePlanWork);
        return await createdPlanWork.save();
    }

    async cargaMasivaPlanWorkRoot(inputCreatePlanWork: PlanWorkRegisterInput[]):
        Promise<PlanWorkRegisterDto[]> {
        const planWork = inputCreatePlanWork.map(planWork => new this.planWorkModel(planWork));

        if (planWork.length > 0) {
            return await this.planWorkModel.insertMany(planWork);
        }

        return [];
    }

    async getPlanWorkRoot(): Promise<PlanWorkQueryDto[]> {
        return await this.planWorkModel.find({ status:'active' }).exec();
    }

    async getPlanWorkRootById(id: string): Promise<PlanWorkRegisterDto> {
        return await this.planWorkModel.findById(id).exec();
    }

    async updatePlanWorkRoot(id: string, inputUpdatePlanWork: PlanWorkRegisterInput):
        Promise<PlanWorkRegisterDto> {
        return await this.planWorkModel.findByIdAndUpdate(id, inputUpdatePlanWork, { new: true }).exec();
    }


}

