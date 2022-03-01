
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRegisterdto } from 'src/users/dto';
import { UserRegisterInput } from 'src/users/inputs';
import { AuthService } from './auth.service';
import { UserTokenDto } from '../users/dto/user-token.dto';
import { LoginAuthInput } from './inputs';

@Resolver()
export class AuthResolver {
    constructor( private readonly authService:AuthService ) {}

    @Query(() => String)
    async hello() {
        return 'Hello World!';
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
}
