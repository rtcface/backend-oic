
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRegisterInput } from 'src/users/inputs';
import { AuthService } from './auth.service';
import { UserTokenDto } from '../users/dto/user-token.dto';
import { LoginAuthInput } from './inputs';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
    constructor( private readonly authService:AuthService ) {}
    @UseGuards(GqlAuthGuard)
    @Query(() => UserTokenDto)
    async verify_authentication( @Args('token') token: string) {
        return this.authService.validateToken(token);
       
    }

    @Mutation(() => UserTokenDto)
    async register(
        @Args('input') inputUser: UserRegisterInput,
    ) {
        const createdUser =  this.authService.AuthRegister(inputUser);
        
        if ((await createdUser).haveError) {
            return createdUser;
        } else {
        createdUser.then(user => {
            delete user.user.password;
            return user;
        });
        return createdUser;
    }
    }

    @Mutation(() => UserTokenDto)
    async login(@Args('input') loginInput: LoginAuthInput) {
        return this.authService.login(loginInput);
    }

    @Mutation(() => UserTokenDto)
    async refreshToken(@Args('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }

   
}
