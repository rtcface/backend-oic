//#region Imports
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlanWorkChSchema } from './schemas/plan-work-ch.schema';


import { 
    PlanWorkRegisterDto, 
    PlanWorkParentRegisterDto,
    PlanWorkChildRegisterDto,
    PlanWorkRegisterDtoOuput,
    PlanWorkParentRegisterDtoOutput,
   
  } from './dto';
import { 
    PlanWorkRegisterInput,    
    PlanWorkParentRegisterInput,
    PlanWorkChildRegisterInput,
    PlanWorkUpdate,
    PlanWorkParentUpdate,
} from './inputs';
import { AnyFilesInterceptor } from '@nestjs/platform-express';


//#endregion



@Injectable()
export class PlanWorkService {

    addParent: any;
    planWorkUpdateInRoot: PlanWorkUpdate;
    planWorkUpdateInParent: PlanWorkParentUpdate;
    planWorkRegisterDtoOuput: PlanWorkRegisterDtoOuput;

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
            try {PlanWorkRegisterDtoOuput
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
            const planWork = await this.planWorkModel.find({ status:'active', ente_publico:'622a569c09e418288ff852fa' })
            .populate(
                {
                     path: 'children',
                        populate: {
                            path: 'children',
                            model: 'PlanWorkChild',                            
                        }
                     }   
            )        
           .exec();
            
                

        
            console.log(planWork);

             planWork.forEach(element => {
                     console.log("Element",element);
                    //  this.planWorkRegisterDtoOuput = new PlanWorkRegisterDtoOuput();
                    //     this.planWorkRegisterDtoOuput.id = element._id;
                    //     this.planWorkRegisterDtoOuput.label = element.label;
                    //     this.planWorkRegisterDtoOuput.data = element.data;
                    //     this.planWorkRegisterDtoOuput.expandedIcon = element.expandedIcon;
                    //     this.planWorkRegisterDtoOuput.collapsedIcon = element.collapsedIcon;
                    //     this.planWorkRegisterDtoOuput.createdAt = element.createdAt;
                    //     this.planWorkRegisterDtoOuput.updatedAt = element.updatedAt;
                    //     this.planWorkRegisterDtoOuput.status = element.status;
                        
                     element.children.forEach(element => {
                        // const parent = new PlanWorkParentRegisterDtoOutput();
                        // const dat:any = element;
                        // parent.id = dat._id;
                        // parent.label = dat.label;
                        // parent.data = dat.data;
                        // parent.expandedIcon = dat.expandedIcon;
                        // parent.collapsedIcon = dat.collapsedIcon;
                        // parent.createdAt = dat.createdAt;
                        // parent.updatedAt = dat.updatedAt;
                        // parent.status = dat.status;
                        // console.log("Parent",parent);
                        // this.planWorkRegisterDtoOuput.children.push(parent);

                        
                        // const item = new PlanWorkParentRegisterDtoOutput();
                        // item.id = element._id;


                         //console.log("cadena",element);
                         // console.log(element);
                         // element
                        //console.log("This",this.planWorkRegisterDtoOuput);
                        
                     });
             });
            
            // planWork.forEach(element => 
            // {
            //     //console.log(element);
            //     element.children.forEach(item =>
            //     {
                    
            //     });
              
            

               
            // //    const children:any = element.children;
               
              


            //     //console.log(element);
                
            //     // children.forEach(item =>
            //     // {
            //     //     console.log(element);
            //     // });

               
            //     //console.log("Children==>",children);
            //     // if (children.length > 0) 
            //     // {
            //     //   children.forEach(child => 
            //     //     {
            //     //         const childrenChild = child.children;
            //     //         if (childrenChild.length > 0) 
            //     //         {
            //     //         childrenChild.forEach(childChild => 
            //     //             {
            //     //             //console.log("Child Child==>",childChild);
            //     //         });
            //     //     }
            //     // });  
            //     // //console.log(element.children[0]);
                                    
            //     // }
            // });
       

            











            return planWork;
                     
        } catch (error) {
            console.log(error);
            return [];
        }  
        
    }
    
    transformChildren(children: any) {
        return children.map(child => {
            return {
                ...child,
                children: this.transformChildren(child.children)
            }
        });

    }


    

    //#endregion

}

