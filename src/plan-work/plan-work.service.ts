//#region Imports
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { 
    PlanWorkRegisterDto, 
    PlanWorkParentRegisterDto,
    PlanWorkChildRegisterDto,   
  } from './dto';
import { 
    PlanWorkRegisterInput,    
    PlanWorkParentRegisterInput,
    PlanWorkChildRegisterInput,
    PlanWorkUpdate,
} from './inputs';

//#endregion



@Injectable()
export class PlanWorkService {

    constructor(
        @InjectModel('PlanWorkGrandParent') private readonly planWorkModel: Model<PlanWorkRegisterDto>,
        @InjectModel('PlanWorkParent') private readonly planWorkParentModel: Model<PlanWorkParentRegisterDto>,
        @InjectModel('PlanWorkChild') private readonly planWorkChildModel: Model<PlanWorkChildRegisterDto>,
    ) { }
   

    //#region Plan Work GrandParent   
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

    async getPlanWorkRoot(): Promise<PlanWorkRegisterDto[]> {
        return await this.planWorkModel.find({ status:'active' }).exec();
    }

    async getPlanWorkRootById(id: string): Promise<PlanWorkRegisterDto> {
        return await this.planWorkModel.findById(id).exec();
    }

    async updatePlanWorkRoot(id: string, inputUpdatePlanWork: PlanWorkRegisterInput):
        Promise<PlanWorkRegisterDto> {
        return await this.planWorkModel.findByIdAndUpdate(id, inputUpdatePlanWork, { new: true }).exec();
    }

    async addPlanWorkParentInRoot(inputCreatePlanWork: PlanWorkUpdate):
        Promise<PlanWorkRegisterDto> {
         inputCreatePlanWork.children.length > 0 ?
            await this.planWorkModel.findByIdAndUpdate(inputCreatePlanWork.id, 
                { children: inputCreatePlanWork.children }, { new: true }).exec() :
            await this.planWorkModel.findByIdAndUpdate(inputCreatePlanWork.id,
                 { children: [] }, { new: true }).exec();
        return await this.planWorkModel.findById(inputCreatePlanWork.id).exec();
        // const createdPlanWork = new this.planWorkModel(inputCreatePlanWork);        
        // return await createdPlanWork.save();
    }

    async inacvitePlanWorkRoot(id: string): Promise<PlanWorkRegisterDto> {  
        return await this.planWorkModel.findByIdAndUpdate(id, { status:'inactive' }, { new: true }).exec();
    }

    //#endregion

    //#region Plan Work Parent
    async addPlanWorkParent(inputCreatePlanWork: PlanWorkParentRegisterInput):
        Promise<PlanWorkParentRegisterDto> {
        const createdPlanWork = new this.planWorkParentModel(inputCreatePlanWork);
        return await createdPlanWork.save();
    }

    async cargaMasivaPlanWorkParent(inputCreatePlanWork: PlanWorkParentRegisterInput[]):
        Promise<PlanWorkParentRegisterDto[]> {
        const planWork = inputCreatePlanWork.map(planWork => new this.planWorkParentModel(planWork));

        if (planWork.length > 0) {
            return await this.planWorkParentModel.insertMany(planWork);
        }

        return [];
    }

    async getPlanWorkParent(): Promise<PlanWorkParentRegisterDto[]> {
        return await this.planWorkParentModel.find({ status:'active' }).exec();
    }

    async getPlanWorkParentById(id: string): Promise<PlanWorkParentRegisterDto> {
        return await this.planWorkParentModel.findById(id).exec();
    }

    async updatePlanWorkParent(id: string, inputUpdatePlanWork: PlanWorkParentRegisterInput):
        Promise<PlanWorkParentRegisterDto> {
        return await this.planWorkParentModel.findByIdAndUpdate(id, inputUpdatePlanWork, { new: true }).exec();
    }

    async inacvitePlanWorkParent(id: string): Promise<PlanWorkParentRegisterDto> {
        return await this.planWorkParentModel.findByIdAndUpdate(id, { status:'inactive' }, { new: true }).exec();
    }

    //#endregion

    //#region Plan Work Child
    async addPlanWorkChild(inputCreatePlanWork: PlanWorkChildRegisterInput):
        Promise<PlanWorkChildRegisterDto> {
        const createdPlanWork = new this.planWorkChildModel(inputCreatePlanWork);
        return await createdPlanWork.save();
    }

    async cargaMasivaPlanWorkChild(inputCreatePlanWork: PlanWorkChildRegisterInput[]):
        Promise<PlanWorkChildRegisterDto[]> {
        const planWork = inputCreatePlanWork.map(planWork => new this.planWorkChildModel(planWork));

        if (planWork.length > 0) {
            return await this.planWorkChildModel.insertMany(planWork);
        }

        return [];
    }

    async getPlanWorkChild(): Promise<PlanWorkChildRegisterDto[]> {
        return await this.planWorkChildModel.find({ status:'active' }).exec();
    }

    async getPlanWorkChildById(id: string): Promise<PlanWorkChildRegisterDto> {
        return await this.planWorkChildModel.findById(id).exec();
    }

    async updatePlanWorkChild(id: string, inputUpdatePlanWork: PlanWorkChildRegisterInput):
        Promise<PlanWorkChildRegisterDto> {
        return await this.planWorkChildModel.findByIdAndUpdate(id, inputUpdatePlanWork, { new: true }).exec();
    }

    async inacvitePlanWorkChild(id: string): Promise<PlanWorkChildRegisterDto> {
        return await this.planWorkChildModel.findByIdAndUpdate(id, { status:'inactive' }, { new: true }).exec();
    }

    //#endregion


    //#region Plan Work Data
   
        

    //#endregion

}

