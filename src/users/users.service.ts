import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRegisterdto, UserUpdatedto } from './dto';
import { UserRegisterInput, UserUpdateInput, UserContralorRegisterInput, UserAdminRegisterInput, UserColaboradorRegisterInput  } from './inputs';





@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly usersModel: Model<UserRegisterdto>        
        ) {}

    async register (inputUser: UserRegisterInput): Promise<UserRegisterdto> {
        const createdUser = new this.usersModel(inputUser);
        return await createdUser.save();
    }

    async addColaborador(id: string, colaborador: string): Promise<UserRegisterdto> {
        try {
        return await this.usersModel.
        findByIdAndUpdate(id,
             { $push: {colaboradores: colaborador} },
             {new: true}).exec();
        } catch (error) {
            console.log(error);
        }
    }

    async registerColaborador (inputUser: UserColaboradorRegisterInput): 
    Promise<UserRegisterdto> {
        try {
            const createdUser = new this.usersModel(inputUser);
            const children = createdUser.id;
            const parent = inputUser.parentId;

            await this.addColaborador(parent, children);

            return await createdUser.save();
            
        } catch (error) {
            console.log(error);
            return error;
        }
       
    }

    async registerContralor (inputUser: UserContralorRegisterInput): Promise<UserRegisterdto> {
        const createdUser = new this.usersModel(inputUser);
        return await createdUser.save();
    }

    async registerAdmin (inputUser: UserAdminRegisterInput): Promise<UserRegisterdto> {
        const createdUser = new this.usersModel(inputUser);
        return await createdUser.save();
    }

    async getUsers(): Promise<UserRegisterdto[]> {
        const users = await this.usersModel.find().where({status:'active'}).exec();
        users.map(user => {
            delete user.password;
            return user;
        });
        return users;
    }

    async findUserByEmail(email: string): Promise<UserRegisterdto> {        
       return  await this.usersModel.findOne({email:email, status:'active'});       
    }

    async findUserByEmailGeneral(email: string): Promise<UserRegisterdto> {        
        return  await this.usersModel.findOne({email:email});       
     }

    async updateUser(user: UserUpdateInput): Promise<UserUpdatedto> {
        const {password} = user;
        user.password = await this.hashePassword(password);
        return await this.usersModel.findByIdAndUpdate(user.id, user, {new: true});
    }

    private async hashePassword(password:string): Promise<string> {
        const salt = await bcrypt.genSaltSync(10);
        return await bcrypt.hash(password, salt);
    }

    async inactivateUser(id: string): Promise<UserRegisterdto> {
        return await this.usersModel.findByIdAndUpdate(id, {status: 'inactive'}, {new: true});
    }

    async activateUser(id: string): Promise<UserRegisterdto> {
        return await this.usersModel.findByIdAndUpdate(id, {status: 'active'}, {new: true});
    }

    async findUserByRefreshToken(refreshToken: string): Promise<UserRegisterdto> {
        return await this.usersModel.findOne({refreshToken: refreshToken});
    }

    async findUserById (id: string): Promise<UserRegisterdto> {
        return await this.usersModel.findById(id);
    }

    // async getFullTree(id: string): Promise<UserRegisterdto> {
    //     const user = await this.usersModel.findById(id);
    //     const colaboradores = await this.usersModel.find({parentId: user.id});
    //     const children = colaboradores.map(colaborador => {
    //         return colaborador.id;
    //     }).concat(user.id);
    //     const users = await this.usersModel.find({_id: {$in: children}});
    //     return users;
    // }

    


}
