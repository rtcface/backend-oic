import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterInput } from 'src/users/inputs';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MESSAGES } from './auth.constants';
import { UserTokenDto } from '../users/dto/user-token.dto';
import { LoginAuthInput } from './inputs';
import { UserRegisterdto } from '../users/dto/user-register.dto';

@Injectable()
export class AuthService {

    constructor( private readonly userService: UsersService,
        private readonly jwtService: JwtService,) {}

    async AuthRegister(inputUser: UserRegisterInput): Promise<UserTokenDto> {
        const ustmp:UserRegisterdto={
            id: '',
            name: '',
            email: '',
            password: '',
            createdAt: undefined,
            status: '',
            avatar: '',
            role: '',
            createByGoogle: false
        };
        const {name , email, password} = inputUser;
        const foundUser = await this.userService.findUserByEmailGeneral(email);
        if (foundUser) {
            return {
                haveError: true,
                Err: `${MESSAGES.UNAUTHORIZED_EMAIL_IN_USE}`,
                user: foundUser,
                token: ""
            }        
        }
        
        const createdUser = await this.userService.register({
            name,
            email,
            password: await this.hashePassword(password)
        });

       
       
        return {
            haveError: false,
            Err: "", 
            user: createdUser,
            token: this.singToken(createdUser.id)
         };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findUserByEmail(email);
        if (user && user.password === password) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

    

    private singToken(id:string):string {
        return this.jwtService.sign({ id });
    }

    public async login(loginInput:LoginAuthInput): Promise<UserTokenDto> {
        const user = await this.userService.findUserByEmail(loginInput.email);
        if (!user) {
            throw new BadRequestException(`${MESSAGES.UNAUTHORIZED_INVALID_EMAIL} `);
        }
        const isValid = await bcrypt.compare(loginInput.password, user.password);
        if (!isValid) {
            throw new BadRequestException(`${MESSAGES.UNAUTHORIZED_INVALID_PASSWORD} `);
        }
        user.password = "";
        return {
            haveError: false,
            Err: "", 
            user,
            token: this.singToken(user.id)
         };
    }

    private async hashePassword(password:string): Promise<string> {
        const salt = await bcrypt.genSaltSync(10);
        return await bcrypt.hash(password, salt);
    }



}
