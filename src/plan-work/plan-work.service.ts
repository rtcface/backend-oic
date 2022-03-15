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
    PlanWorkParentUpdate,
} from './inputs';
import { PlanWorkRegisterDtoOuput } from './dto/plan-work-register.dto';

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
    ) {    
    }
   

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
         console.log("addPlanWorkParentInRoot-->>>>>>>>>",inputCreatePlanWork);
        try {
        return await this.planWorkModel.
            findByIdAndUpdate(inputCreatePlanWork.id, 
                { $push: { children: inputCreatePlanWork.children } }, 
                { new: true }).exec();
                // Esto es para actualizar solo un unico campo
        //  inputCreatePlanWork.children.length > 0 ?
        //     await this.planWorkModel.findByIdAndUpdate(inputCreatePlanWork.id, 
        //         { children: inputCreatePlanWork.children }, { new: true }).exec() :
        //     await this.planWorkModel.findByIdAndUpdate(inputCreatePlanWork.id,
        //          { children: [] }, { new: true }).exec();
        // return await this.planWorkModel.findById(inputCreatePlanWork.id).exec();
        } catch (error) {
            console.log(error);
            return error;
        }
       
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
    Promise<PlanWorkParentRegisterDto> {
        try {
            return await this.planWorkParentModel.
                findByIdAndUpdate(inputCreatePlanWork.id,
                    { $push: { children: inputCreatePlanWork.children } },
                    { new: true }).exec();
        } catch (error) {
            console.log(error);
            return error;
        }
    // inputCreatePlanWork.children.length > 0 ?
    //     await this.planWorkParentModel.findByIdAndUpdate(inputCreatePlanWork.id,
    //         { children: inputCreatePlanWork.children }, { new: true }).exec() :
    //     await this.planWorkParentModel.findByIdAndUpdate(inputCreatePlanWork.id,
    //         { children: [] }, { new: true }).exec();
    // return await this.planWorkChildModel.findById(inputCreatePlanWork.id).exec();}
   
}

    //#endregion

    //#region Plan Work Child
    async addPlanWorkChild(inputCreatePlanWork: PlanWorkChildRegisterInput):
        Promise<PlanWorkChildRegisterDto> {
        try {           
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

    //#region Tree Plan Work
        // get the tree of plan work with populate in planWorkModel, planWorkParentModel, planWorkChildModel
     async getFullTree() {
        try {
            const planWork = await this.planWorkModel.find({ status:'active' })
            .populate('children')
            .populate('children.children')
            .exec();
            console.log(planWork);

       












            return planWork;



    //    let  root: any;
    //     try {

    //         const dat =await this.planWorkModel
    //             .find({ status:'active' }).populate('children').exec(),
    //             dat2 = await this.planWorkParentModel
    //             .find({ status:'active' }).populate('children').exec(),
    //             dat3 = await this.planWorkChildModel
    //             .find({ status:'active' }).exec();

    //             root= dat.map(child => {
    //                         return {
    //                             id: child._id,
    //                             label: child.label,
    //                             data: child.data,  
    //                             children: child.children                             
    //                         }
    //                     });

                     

    //             console.log({
    //                 root: root,
    //                 planWork: dat,
    //                 planWorkParent: dat2,
    //                 planWorkChild: dat3
    //             });

                
    //         return {'data': dat, 'data2': dat2, 'data3': dat3};
               
                     
        } catch (error) {
            console.log(error);
            return [];
        }  
        
    }
    
    

    //#endregion

}

