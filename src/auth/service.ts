import { Injectable } from '@nestjs/common';
import { UserRegisterdto } from '../users/dto/user-register.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserRegisterdto | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result as UserRegisterdto;
    }
    return null;
  }

  private verifyToken(token: string): Record<string, unknown> {
    return this.jwtService.verify(token);
  }
}
