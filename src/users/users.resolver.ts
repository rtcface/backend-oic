import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRegisterdto } from './dto/user-register.dto';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserUpdateInput } from './inputs/user-update.input';

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
    @Mutation( () => UserRegisterdto )
    async updateUser(
        @Args('input') inputUpdateUser: UserUpdateInput) {
        return await this.usersService.updateUser(inputUpdateUser);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation( () => UserRegisterdto )
    async inactivateUser(
        @Args('id') id: string) {
        return await this.usersService.inactivateUser(id);
    }

}
