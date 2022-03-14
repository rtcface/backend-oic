//#region imports
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PlanWorkService } from './plan-work.service';
import { 
    PlanWorkParentQueryDto,
    PlanWorkParentUpdateDto,
    PlanWorkParentRegisterDto,
    PlanWorkRegisterDto,
    PlanWorkUpdateDto
} from './dto';
import { 
    PlanWorkRegisterInput,
    PlanWorkParentRegisterInput,
 } from './inputs';

import { GqlAuthGuard } from 'src/auth/guards';
import {  } from './dto/plan-work-parent-register.dto';
import { PlanWorkUpdate } from './inputs/plan-work-update.input';
//#endregion


@Resolver()
export class PlanWorkResolver {
    
    constructor( private readonly planWorkService:PlanWorkService) {}

    //#region Resolvers Plan Work GrandParent
    @Query( () => [PlanWorkRegisterDto] )
    async getPlanRootWorks() {
        return await this.planWorkService.getPlanWorkRoot();
    }

    @UseGuards(GqlAuthGuard)
    @Query( () => PlanWorkRegisterDto )
    async getPlanRootWorkById(@Args('id') id: string) {
        return await this.planWorkService.getPlanWorkRootById(id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => PlanWorkRegisterDto )
    async addPlanRootWork(@Args('input') inputCreatePlanWork: PlanWorkRegisterInput) {
        return await this.planWorkService.addPlanWorkRoot(inputCreatePlanWork);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => PlanWorkRegisterDto )
    async updatePlanRootWork(@Args('id') id: string, @Args('input') inputUpdatePlanWork: PlanWorkRegisterInput) {
        return await this.planWorkService.updatePlanWorkRoot(id, inputUpdatePlanWork);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => PlanWorkUpdateDto )
    async updatePlanWork(@Args('input') inputUpdatePlanWork: PlanWorkUpdate) {
        return await this.planWorkService.addPlanWorkParentInRoot(inputUpdatePlanWork);
    }
    //#endregion

    //#region Resolvers Plan Work Parent
    
    @Query( () => [PlanWorkParentQueryDto] )
    async getPlanWorkParents() {
        return await this.planWorkService.getPlanWorkParent();
    }
    @Query( () => [PlanWorkParentQueryDto] )
    async getPlanWorkParentById(@Args('id') id: string) {
        return await this.planWorkService.getPlanWorkParentById(id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => PlanWorkParentRegisterDto )
    async addPlanWorkParent(@Args('input') inputCreatePlanWork: PlanWorkParentRegisterInput) {
        return await this.planWorkService.addPlanWorkParent(inputCreatePlanWork);
    }

    @Mutation( () => PlanWorkParentUpdateDto )
    async updatePlanWorkParent(@Args('id') id: string, @Args('input') inputUpdatePlanWork: PlanWorkParentRegisterInput) {
        return await this.planWorkService.updatePlanWorkParent(id, inputUpdatePlanWork);
    }
    //#endregion
    
    //#region Resolvers Plan Work GrandParent whit Plan Work Parent
    
    //#endregion

    

}
