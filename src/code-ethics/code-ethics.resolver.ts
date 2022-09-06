import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CodeEthicsService } from './code-ethics.service';
import { CodeEthicsRegisterDto } from './dto/code-ethics-register.dto';
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
    @Query( () => [CodeEthicsRegisterDto] )
    async getCodeEthics(){
        return await this.ces.getCodeEthics();
    }

    @UseGuards(GqlAuthGuard)
    @Query( () => CodeEthicsRegisterDto)
    async getCodeEthicsById(@Args('id') id: string){
        return await this.ces.getCodeEthicById(id);
    }
    

}
