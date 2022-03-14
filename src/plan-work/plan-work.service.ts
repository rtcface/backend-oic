//#region Imports
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { 
    PlanWorkRegisterDto, 
    PlanWorkParentRegisterDto,
    PlanWorkChildRegisterDto,
    PlanWorkDataDto,   
    TreeRootDto,
  } from './dto';
import { 
    PlanWorkRegisterInput,    
    PlanWorkParentRegisterInput,
    PlanWorkChildRegisterInput,
    PlanWorkUpdate,
    PlanWorkParentUpdate,
} from './inputs';

//#endregion



@Injectable()
export class PlanWorkService {

    addParent: any;
    planWorkUpdateInRoot: PlanWorkUpdate;
    planWorkUpdateInParent: PlanWorkParentUpdate;
    constructor(
        @InjectModel('PlanWorkGrandParent') private readonly planWorkModel: Model<PlanWorkRegisterDto>,
        @InjectModel('PlanWorkParent') private readonly planWorkParentModel: Model<PlanWorkParentRegisterDto>,
        @InjectModel('PlanWorkChild') private readonly planWorkChildModel: Model<PlanWorkChildRegisterDto>,
    ) { }
   

    //#region Plan Work GrandParent   
    async addPlanWorkRoot(inputCreatePlanWork: PlanWorkRegisterInput): 
        Promise<PlanWorkRegisterDto> {
            try {
                const createdPlanWork = new this.planWorkModel(inputCreatePlanWork);
                return await createdPlanWork.save();
            } catch (error) {
                console.log(error);
                return error;
            }     
    }

    async cargaMasivaPlanWorkRoot(inputCreatePlanWork: PlanWorkRegisterInput[]):
        Promise<PlanWorkRegisterDto[]> {
        try {
            const planWork = inputCreatePlanWork.map(planWork => new this.planWorkModel(planWork));

            if (planWork.length > 0) {
                return await this.planWorkModel.insertMany(planWork);
            }
        } catch (error) {
            console.log(error);
            return [];
        }
        return [];        
    }

    async getPlanWorkRoot(): Promise<PlanWorkRegisterDto[]> {
        try {
            return await this.planWorkModel.find({ status:'active' }).exec();
        } catch (error) {
            console.log(error);
            return [];
        }       
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
         //console.log(inputCreatePlanWork);
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
        try {
            const createdPlanWork = new this.planWorkParentModel(inputCreatePlanWork);      
        
            this.planWorkUpdateInRoot = {
                id: inputCreatePlanWork.IdRoot,
                children: [createdPlanWork._id]
            }
            await this.addPlanWorkParentInRoot(this.planWorkUpdateInRoot);
            return await createdPlanWork.save();
        } catch (error) {
            console.log(error);         
            return error;
        }
       
    }

    async cargaMasivaPlanWorkParent(inputCreatePlanWork: PlanWorkParentRegisterInput[]):
        Promise<PlanWorkParentRegisterDto[]> {
            try {
                const planWork = inputCreatePlanWork.map(planWork => new this.planWorkParentModel(planWork));

                if (planWork.length > 0) {
                    return await this.planWorkParentModel.insertMany(planWork);
                }

            } catch (error) {
                console.log(error);
                return [];
            }        
        
        return [];
    }

    async getPlanWorkParent(): Promise<PlanWorkParentRegisterDto[]> {
        try {
            return await this.planWorkParentModel.find({ status:'active' }).exec();
            
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }

    async getPlanWorkParentById(id: string): Promise<PlanWorkParentRegisterDto> {
        try {
            return await this.planWorkParentModel.findById(id).exec();
            
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async updatePlanWorkParent(id: string, inputUpdatePlanWork: PlanWorkParentRegisterInput):
        Promise<PlanWorkParentRegisterDto> {
            try {
                return await this.planWorkParentModel.findByIdAndUpdate(id, inputUpdatePlanWork, { new: true }).exec();
                
            } catch (error) {                
                console.log(error);
                return error;
            }
    }

    async inacvitePlanWorkParent(id: string): Promise<PlanWorkParentRegisterDto> {
        try {
            return await this.planWorkParentModel.findByIdAndUpdate(id, { status:'inactive' }, { new: true }).exec();
            
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async addPlanWorkChildInParent(inputCreatePlanWork: PlanWorkParentUpdate):
    Promise<PlanWorkChildRegisterDto> {
        try {
    inputCreatePlanWork.children.length > 0 ?
        await this.planWorkParentModel.findByIdAndUpdate(inputCreatePlanWork.id,
            { children: inputCreatePlanWork.children }, { new: true }).exec() :
        await this.planWorkParentModel.findByIdAndUpdate(inputCreatePlanWork.id,
            { children: [] }, { new: true }).exec();
    return await this.planWorkChildModel.findById(inputCreatePlanWork.id).exec();}
    catch (error) {
        console.log(error);
        return error;
    }
}

    //#endregion

    //#region Plan Work Child
    async addPlanWorkChild(inputCreatePlanWork: PlanWorkChildRegisterInput):
        Promise<PlanWorkChildRegisterDto> {
        try {
            console.log(inputCreatePlanWork);
            const createdPlanWork = new this.planWorkChildModel(inputCreatePlanWork);
            this.planWorkUpdateInParent = {
                id: inputCreatePlanWork.IdParent,
                children: [createdPlanWork._id]
            }
            await this.addPlanWorkChildInParent(this.planWorkUpdateInParent);
            return await createdPlanWork.save();
        } catch (error) {
            console.log(error);
            return error;
        }
     
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
   
     async getPlanWorkData() {
        const dat = await (await this.planWorkModel.populate(this.planWorkModel.find({ status:'active' }), { path: 'children' }));
        return dat;
        console.log(dat);
        
    }
    
    

    //#endregion

}

