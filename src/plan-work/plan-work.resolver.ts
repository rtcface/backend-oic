import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PlanWorkService } from './plan-work.service';
import { PlanWorkQueryDto } from './dto';
import { PlanWorkRegisterInput } from './inputs';
import { GqlAuthGuard } from 'src/auth/guards';

@Resolver()
export class PlanWorkResolver {
    
    constructor( private readonly planWorkService:PlanWorkService) {}

    @Query( () => [PlanWorkQueryDto] )
    async getPlanRootWorks() {
        return await this.planWorkService.getPlanWorkRoot();
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => PlanWorkQueryDto )
    async getPlanRootWorkById(@Args('id') id: string) {
        return await this.planWorkService.getPlanWorkRootById(id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => PlanWorkQueryDto )
    async addPlanRootWork(@Args('input') inputCreatePlanWork: PlanWorkRegisterInput) {
        return await this.planWorkService.addPlanWorkRoot(inputCreatePlanWork);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => PlanWorkQueryDto )
    async updatePlanRootWork(@Args('id') id: string, @Args('input') inputUpdatePlanWork: PlanWorkRegisterInput) {
        return await this.planWorkService.updatePlanWorkRoot(id, inputUpdatePlanWork);
    }

}
