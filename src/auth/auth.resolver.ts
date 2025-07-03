import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  UserAdminRegisterInput,
  UserColaboradorRegisterInput,
  UserContralorRegisterInput,
  UserRegisterInput,
} from '../users/inputs';
import { AuthService } from './auth.service';
import { UserTokenDto } from '../users/dto/user-token.dto';
import { LoginAuthInput, UserChangePassInput } from './inputs';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(GqlAuthGuard)
  @Query(() => UserTokenDto)
  async verify_authentication(@Args('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Mutation(() => UserTokenDto)
  async register(@Args('input') inputUser: UserRegisterInput) {
    const createdUser = this.authService.AuthRegister(inputUser);

    if ((await createdUser).haveError) {
      return createdUser;
    } else {
      createdUser.then((user) => {
        delete user.user.password;
        return user;
      });
      return createdUser;
    }
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserTokenDto)
  async registerContralor(
    @Args('input') inputUser: UserContralorRegisterInput,
  ) {
    const createdUser = this.authService.AuthRegisterContralor(inputUser);

    if ((await createdUser).haveError) {
      return createdUser;
    } else {
      createdUser.then((user) => {
        delete user.user.password;
        return user;
      });
      return createdUser;
    }
  }
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => UserTokenDto)
  async registerAdmin(@Args('input') inputUser: UserAdminRegisterInput) {
    const createdUser = this.authService.AuthRegisterAdmin(inputUser);

    if ((await createdUser).haveError) {
      return createdUser;
    } else {
      createdUser.then((user) => {
        delete user.user.password;
        return user;
      });
      return createdUser;
    }
  }

  // Resolver for add colaborador

  @Mutation(() => UserTokenDto)
  async registerColaborador(
    @Args('input') inputUser: UserColaboradorRegisterInput,
  ) {
    const createdUser = this.authService.AuthRegisterColaborador(inputUser);

    if ((await createdUser).haveError) {
      return createdUser;
    } else {
      createdUser.then((user) => {
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
  async changePassword(
    @Args('input') changePasswordInput: UserChangePassInput,
  ) {
    return this.authService.changePassword(changePasswordInput);
  }

  @Mutation(() => UserTokenDto)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
