import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EthicsCommittedtoOutput, EthicsCommitteRegisterdto } from './dto/ethics_committe_register.dto';
import { EthicsCommitteService } from './ethics-committe.service';
import { CommitteColaboradoresQueryInput } from './inputs/ethics_committe_query.input';
import { EthicsCommitteMemberRegisterInput, EthicsCommitteRegisterInput } from './inputs/ethics_committe_register.input';

@Resolver()
export class EthicsCommitteResolver {
    constructor(private readonly ecs:EthicsCommitteService) {}

    @Mutation(() => EthicsCommitteRegisterdto )
    async registerPresident(
        @Args('input') inputUser: EthicsCommitteRegisterInput,
    ) {
        const createdUser =  this.ecs.registerPrecident(inputUser);
        
        // TODO: validar errores
        // if (!(await createdUser).id) {
        //     return createdUser;
        // } else {
        // createdUser.then(user => {
        //     delete user.user.password;
        //     return user;
        // });


        return createdUser;
    
    }

     // Resolver for add colaborador

     @Mutation(() => EthicsCommitteRegisterdto)
     async registerMember(
         @Args('input') inputUser: EthicsCommitteMemberRegisterInput,
     ) {
         const createdUser =  this.ecs.registerMember(inputUser);
 
        //  if ((await createdUser).haveError) {
        //      return createdUser;
        //  }else {
        //  createdUser.then(user => {
        //      delete user.user.password;
        //      return user;
        //  }
        //  );
         return createdUser;
         
     }

     @Query( () => EthicsCommittedtoOutput || [] )
    async getCommitteMembesTreeData(@Args('input') input: CommitteColaboradoresQueryInput){
        return await this.ecs.getColaboradores(input);
    }


}
