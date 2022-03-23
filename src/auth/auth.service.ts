import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterInput } from 'src/users/inputs';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MESSAGES, TEMP_KEY_SEE, TEMP_KEY_SEE_ADMIN } from './auth.constants';
import { UserTokenDto } from '../users/dto/user-token.dto';
import { LoginAuthInput } from './inputs';
import { UserRegisterdto } from '../users/dto/user-register.dto';
import { UserContralorRegisterInput, UserAdminRegisterInput } from '../users/inputs/user-register.input';

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
            createByGoogle: false,
            charge: undefined,
            phone: '',
            firstSignIn: false
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

    async changePassword( token: string, newPassword: string): Promise<UserTokenDto> {
        const { id } = this.verifyToken(token);
        const user = await this.userService.findUserById(id);
        if (!user) {
            throw new BadRequestException(`${MESSAGES.UNAUTHORIZED_INVALID_TOKEN} `);
        }
        const isValid = await bcrypt.compare(newPassword, user.password);
        if (isValid) {
            throw new BadRequestException(`${MESSAGES.UNAUTHORIZED_INVALID_PASSWORD} `);
        }
        user.password = newPassword;
        user.firstSignIn = true;
        this.updateUser(user);
        
        return {
            haveError: false,
            Err: "", 
            user,
            token: this.singToken(user.id)
         };
    }

    private updateUser(user:UserRegisterdto):void {
        this.userService.updateUser(user);
    }

    async AuthRegisterContralor(inputUser:UserContralorRegisterInput): Promise<UserTokenDto> {
        const ustmp:UserRegisterdto={
            id: '',
            name: '',
            email: '',
            password: '',
            createdAt: undefined,
            status: '',
            avatar: '',
            role: '',
            createByGoogle: false,
            charge: undefined,
            phone: '',
            firstSignIn: false
        };
        const {name , email, ente_publico} = inputUser;
        const foundUser = await this.userService.findUserByEmailGeneral(email);
        if (foundUser) {
            return {
                haveError: true,
                Err: `${MESSAGES.UNAUTHORIZED_EMAIL_IN_USE}`,
                user: foundUser,
                token: ""
            }
        }

        const createdUser = await this.userService.registerContralor({            
            name,
            email,
            avatar: "https://w7.pngwing.com/pngs/613/636/png-transparent-computer-icons-user-profile-male-avatar-avatar-heroes-logo-black.png",
            password: await this.hashePassword(TEMP_KEY_SEE),
            role: 'contralor',
            ente_publico
        });

        return {
            haveError: false,
            Err: "",
            user: createdUser,
            token: this.singToken(createdUser.id)
        };
    }

    async AuthRegisterAdmin(inputUser:UserAdminRegisterInput): Promise<UserTokenDto> {
        const ustmp:UserRegisterdto={
            id: '',
            name: '',
            email: '',
            password: '',
            createdAt: undefined,
            status: '',
            avatar: '',
            role: '',
            createByGoogle: false,
            charge: undefined,
            phone: '',
            firstSignIn: false
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

        const createdUser = await this.userService.registerAdmin({
            avatar: 'https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Image.png',
            name,
            email,
            password: await this.hashePassword(TEMP_KEY_SEE_ADMIN),
            role: 'admin'
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

    private verifyToken(token: string): any {
        return this.jwtService.verify(token);
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

    async refreshToken(refreshToken: string): Promise<UserTokenDto> {
        const user = await this.userService.findUserByRefreshToken(refreshToken);
        if (!user) {
            throw new BadRequestException(`${MESSAGES.UNAUTHORIZED_INVALID_REFRESH_TOKEN} `);
        }
        user.password = "";
        return {
            haveError: false,
            Err: "", 
            user,
            token: this.singToken(user.id)
         };
    }

    async validateToken(token: string): Promise<UserTokenDto> {
        
        token = token.replace('Bearer ', '');
        const { id } = this.verifyToken(token);
        const user = await this.userService.findUserById(id);
        if (!user) {
            throw new BadRequestException(`${MESSAGES.UNAUTHORIZED_INVALID_TOKEN} `);
        }
        user.password = "";
        return {
            haveError: false,
            Err: "",
            user,
            token: this.singToken(user.id)
        };
    }



}
