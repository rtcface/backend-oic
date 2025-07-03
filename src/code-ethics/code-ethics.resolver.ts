import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { transcode } from 'buffer';
import { GqlAuthGuard } from '../auth/guards';
import { CodeEthicsService } from './code-ethics.service';
import { CodeEthicsRegisterDto } from './dto/code-ethics-register.dto';
import { CodeEthicsDeleteInput } from './inputs/code-ethics-delete.input';
import { CodeEthicsRegisterInput } from './inputs/code-ethics-register.input';
import { CodeEthicsUpdateInput } from './inputs/code-ethics-update.input';

@Resolver()
export class CodeEthicsResolver {

    constructor(private readonly ces:CodeEthicsService) {}

    @UseGuards(GqlAuthGuard)
    @Mutation( () => CodeEthicsRegisterDto )
    async addCodeEthics(@Args('input') ceri: CodeEthicsRegisterInput ){
        return await this.ces.addCodeEthics(ceri);
    }
    
    @UseGuards(GqlAuthGuard)
    @Mutation( () => CodeEthicsRegisterDto )
    async updateCodeEthics(@Args('input') ceui: CodeEthicsUpdateInput){
        return await this.ces.updateCodeEthics(ceui);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => CodeEthicsRegisterDto)
    async deleteEthicCode(@Args('input') cedi:CodeEthicsDeleteInput ){
        return await this.ces.deleteEthicCode(cedi);
    }
        

    @UseGuards(GqlAuthGuard)
    @Query( () => [CodeEthicsRegisterDto] )
    async getCodeEthics(){
        return await this.ces.getCodeEthics();
    }

    @UseGuards(GqlAuthGuard)
    @Query( () => CodeEthicsRegisterDto)
    async getCodeEthicsById(@Args('id') id: string){
        return await this.ces.getCodeEthicById(id);
    }
    

   
    @Query(() => CodeEthicsRegisterDto)
    async getCdoEthicByEnte( @Args('ente_publico') ente_publico: string){        
        return await this.ces.getCodeEthicByEnte(ente_publico);        
    }

}
