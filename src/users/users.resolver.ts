import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRegisterdto, UserRegisterdtoOutput } from './dto/user-register.dto';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { 
        UserUpdateInput,
        UserUpdateColaboradorInput,
        UserColaboradoresQueryInput,
        UserDeleteInput
        } from './inputs';
import { UserTokenDto } from './dto';


@Resolver()
export class UsersResolver {

    constructor(
        private readonly usersService: UsersService) {}


    @UseGuards(GqlAuthGuard)
    @Query( () => [UserRegisterdto] )
    async getUsers() {
        return await this.usersService.getUsers();
    }

    @UseGuards(GqlAuthGuard)
    @Query( () => UserRegisterdto )
    async getUser(@Args('id') id: string) {
        return await this.usersService.findUserById(id);
    }

    @Query( () => UserRegisterdtoOutput || [] )
    async getColaboresTreeData(@Args('input') input: UserColaboradoresQueryInput){
        return await this.usersService.getColaboradores(input);
    }

    @Query( () => UserRegisterdtoOutput || [] )
    async getComiteTreeData(@Args('input') input: UserColaboradoresQueryInput){
        return await this.usersService.getColaboradoresComite(input);
    }


    @UseGuards(GqlAuthGuard)
    @Mutation( () => UserRegisterdto )
    async updateUser(
        @Args('input') inputUpdateUser: UserUpdateInput) {
        return await this.usersService.updateUser(inputUpdateUser);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => UserTokenDto )
    async updateColaborador(
        @Args('input') inputUpdateUser: UserUpdateColaboradorInput) {
        return await this.usersService.updateUserColaborador(inputUpdateUser);
    }


    @UseGuards(GqlAuthGuard)
    @Mutation( () => UserRegisterdto )
    async inactivateUser(
        @Args('input') inputDeleteUser: UserDeleteInput) {
        return await this.usersService.inactivateUser(inputDeleteUser);
    }



}
