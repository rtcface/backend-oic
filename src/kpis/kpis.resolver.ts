import { Args, Mutation, Resolver,Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { KpisService } from './kpis.service';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { KpisByEnteQueryInput, KpisRegisterInput } from './inputs';
import { KpisQueryDto,KpisRegisterDto } from './dto';
import { KpisUpdateInput } from './inputs/kpis-update.input';

@Resolver()
export class KpisResolver {
    constructor(private readonly kpisService:KpisService) { }

   
    @Query( () => [KpisQueryDto] )
    async getKpis() {
        return await this.kpisService.getKpis();
    }
    
    @UseGuards(GqlAuthGuard)
    @Query( () => KpisQueryDto )
    async getKpisById(@Args('id') id: string) {
        return await this.kpisService.getKpisById(id);
    }
    
    @UseGuards(GqlAuthGuard)
    @Mutation( () => KpisRegisterDto )
    async addKpis(@Args('input') inputAddKpis: KpisRegisterInput) {
        return await this.kpisService.addKpis(inputAddKpis);
    }

    @Query( () => [KpisQueryDto] )
    async getKpisByEnte(@Args('input') input: KpisByEnteQueryInput) {
        return await this.kpisService.getkpisByEnte(input);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => [KpisRegisterDto] )
    async insertManyKpis(@Args({ name: 'data', type: () => [KpisRegisterInput] }) inputAddKpis:KpisRegisterInput[]) {
        return await this.kpisService.cargaMasivaKpis(inputAddKpis);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => KpisRegisterDto )
    async updateKpis(@Args('id') id: string, @Args('input') inputUpdateKpis: KpisUpdateInput) {
        return await this.kpisService.updateKpis(id, inputUpdateKpis);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => KpisRegisterDto )
    async inactivateKpi(@Args('id') id: string){
        return await this.kpisService.inactivateKpis(id);
    } 
}
