import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards';
import { UserTokenCmmDto } from 'src/users/dto';
import { UserDeleteInput, UserUpdateColaboradorInput } from 'src/users/inputs';
import { EthicsCommittedtoOutput, EthicsCommitteRegisterdto } from './dto/ethics_committe_register.dto';
import { EthicsCommitteService } from './ethics-committe.service';
import { CommitteColaboradoresQueryInput } from './inputs/ethics_committe_query.input';
import { EthicsCommitteMemberRegisterInput, EthicsCommitteRegisterInput } from './inputs/ethics_committe_register.input';

@Resolver()
export class EthicsCommitteResolver {
    constructor(private readonly ecs:EthicsCommitteService) {}

    @Query( () => EthicsCommittedtoOutput || [] )
    async getCommitteMembesTreeData(@Args('input') input: CommitteColaboradoresQueryInput){
        return await this.ecs.getColaboradores(input);
    }

    @UseGuards(GqlAuthGuard)
    @Query( () => EthicsCommitteRegisterdto || [])
    async PresidetByEnte( @Args('input') ente_publico: string) {
        return await this.ecs.findPresidentByEnte(ente_publico);
    }


    // Resolver for add colaborador
    @Mutation(() => EthicsCommitteRegisterdto )
    async registerPresident(
        @Args('input') inputUser: EthicsCommitteRegisterInput,
    ) {
        const createdUser =  this.ecs.registerPrecident(inputUser);
        console.log(createdUser);
        return createdUser;
    
    }

     @Mutation(() => EthicsCommitteRegisterdto)
     async registerMember(
         @Args('input') inputUser: EthicsCommitteMemberRegisterInput,
     ) {
         const createdUser =  this.ecs.registerMember(inputUser);     
         return createdUser;
         
     }
     
    @UseGuards(GqlAuthGuard)
    @Mutation( () => UserTokenCmmDto )
    async updateColaboradorCmm(
        @Args('input') inputUpdateUser: UserUpdateColaboradorInput) {
        return await this.ecs.updateUserCmmColaborador(inputUpdateUser);
    }


    @UseGuards(GqlAuthGuard)
    @Mutation( () => EthicsCommitteRegisterdto )
    async inactivateUserCmm(
        @Args('input') inputDeleteUser: UserDeleteInput) {
        return await this.ecs.inactivateUser(inputDeleteUser);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => EthicsCommitteRegisterdto )
    async activateUserCmm(
        @Args('input') inputDeleteUser: UserDeleteInput) {
        return await this.ecs.activateUser(inputDeleteUser);
    }


}
