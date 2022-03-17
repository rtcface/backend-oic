//#region Imports
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlanWorkChSchema } from './schemas/plan-work-ch.schema';


import { 
    PlanWorkRegisterDto, 
    PlanWorkParentRegisterDto,
    PlanWorkChildRegisterDto,
    PlanWorkRegisterDtoOutput,
    PlanWorkParentRegisterDtoOutput,
    PlanWorkChildRegisterDtoOutput,
   
  } from './dto';
import { 
    PlanWorkRegisterInput,    
    PlanWorkParentRegisterInput,
    PlanWorkChildRegisterInput,
    PlanWorkUpdate,
    PlanWorkParentUpdate,
    PlanWorkQueryInput,
} from './inputs';
import { AnyFilesInterceptor } from '@nestjs/platform-express';


//#endregion



@Injectable()
export class PlanWorkService {

    addParent: any;
    planWorkUpdateInRoot: PlanWorkUpdate;
    planWorkUpdateInParent: PlanWorkParentUpdate;
    planWorkRegisterDtoOutput: PlanWorkRegisterDtoOutput;

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
            try {PlanWorkRegisterDtoOutput
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
     async getFullTree(ente_publico:PlanWorkQueryInput): 
     Promise<PlanWorkRegisterDtoOutput | []> {
        try {
            const planWork = await this.planWorkModel.find({ status:'active', ente_publico: ente_publico.ente_publico })
            .populate(
                {
                    path: 'children',
                    model: 'PlanWorkParent',  
                    populate: {
                        path: 'children',
                        model: 'PlanWorkChild',
                    }                              
                }   
            ) 
           .exec();
            
            console.log('antes de planWork', planWork.length);
            if (planWork.length > 0) {
            console.log('despues de planWork', planWork);
            this.planWorkRegisterDtoOutput = new PlanWorkRegisterDtoOutput();
            this.planWorkRegisterDtoOutput.children=[];
            let parent = new PlanWorkParentRegisterDtoOutput();
            parent.children=[];
            const child_data_output:PlanWorkChildRegisterDtoOutput = new PlanWorkChildRegisterDtoOutput();
             planWork.forEach(element => {
             
                        this.planWorkRegisterDtoOutput.id = element._id;
                        this.planWorkRegisterDtoOutput.label = element.label;
                        this.planWorkRegisterDtoOutput.data = element.data;
                        this.planWorkRegisterDtoOutput.expandedIcon = element.expandedIcon;
                        this.planWorkRegisterDtoOutput.collapsedIcon = element.collapsedIcon;
                        this.planWorkRegisterDtoOutput.createdAt = element.createdAt;
                        this.planWorkRegisterDtoOutput.updatedAt = element.updatedAt;
                        this.planWorkRegisterDtoOutput.status = element.status;
                        this.planWorkRegisterDtoOutput.ente_publico = element.ente_publico;
                       
                        
                     element.children.forEach(parent_data => {                      
                         const dat:any = parent_data;
                         parent.id = dat._id;
                         parent.label = dat.label;
                         parent.data = dat.data;
                         parent.expandedIcon = dat.expandedIcon;
                         parent.collapsedIcon = dat.collapsedIcon;
                         parent.createdAt = dat.createdAt;
                         parent.updatedAt = dat.updatedAt;
                         parent.status = dat.status;
                         dat.children.map(child => {
                            const child_data:any = child;
                            
                            child_data_output.id = child_data._id;
                            child_data_output.label = child_data.label;
                            child_data_output.data = child_data.data;
                            child_data_output.expandedIcon = child_data.expandedIcon;
                            child_data_output.collapsedIcon = child_data.collapsedIcon;
                            child_data_output.createdAt = child_data.createdAt;
                            child_data_output.updatedAt = child_data.updatedAt;
                            child_data_output.status = child_data.status;
                            child_data_output.url = child_data.url;
                            parent.children.push(child_data_output);
                      
                            });
                         
                         this.planWorkRegisterDtoOutput.children.push(parent);

                        
                        
                     });
             });
             return this.planWorkRegisterDtoOutput;
            
            } else {
                console.log('else de planWork', planWork.length);
                return [];
            }

           
                     
        } catch (error) {
            console.log(error);
            return [];
        }  
        
    }
    


    

    //#endregion

}

