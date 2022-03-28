import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserQueryDto, UserRegisterdto, UserUpdatedto } from './dto';
import { UserRegisterdtoOutput } from './dto/user-register.dto';
import { UserRegisterInput,
         UserUpdateInput,
         UserContralorRegisterInput,
         UserAdminRegisterInput,
         UserColaboradorRegisterInput,
         UserColaboradoresQueryInput  } from './inputs';






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

     async findUserByEnte(ente: string): Promise<UserRegisterdto[]> {
        return await this.usersModel.find({ente: ente, status:'active',role:'contralor'});
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

    tree_pather:UserRegisterdtoOutput;
    tree_childre:UserRegisterdtoOutput;
    result:UserRegisterdtoOutput[];
    
    
    async getColaboradores(colaborador:UserColaboradoresQueryInput):
    Promise<UserRegisterdtoOutput | []> {
        try {
            const {boss, ente} = colaborador;
            let user;
            if(boss){
                console.log("Entro en if");
            user = await this.usersModel.findById(boss)
            .populate(
                {
                    path: 'colaboradores',
                    Model: 'User',
                    match: {status: 'active'}                    
                }
            ).exec();
            }else{
                // console.log('entro en else');
             user = await this.usersModel.findOne({$and:[{ente_publico: ente}, {status:'active'},{role:'contralor'}]})
                .populate(
                    {
                        path: 'colaboradores',
                        Model: 'User',
                        match: {status: 'active'}                    
                    }
                ).exec();
               
            }
            // console.log(user);
            

            //console.log(user);

            //llenar los datos de los colaboradores
            
            if(user.colaboradores.length > 0){

                this.tree_pather = new UserRegisterdtoOutput;                
           
                this.tree_pather.id = user.id;
                this.tree_pather.label = user.charge;
                this.tree_pather.name = user.name;
                this.tree_pather.email = user.email;              
                this.tree_pather.status = user.status;
                this.tree_pather.role = user.role;                
                this.tree_pather.createdAt = user.createdAt;
                this.tree_pather.data = new UserRegisterdtoOutput;
                this.tree_pather.data.avatar = user.avatar;
                this.tree_pather.data.name= user.name;           
                this.tree_pather.children = [];
               

                user.colaboradores.forEach(colaborador => {
                    this.tree_childre = new UserRegisterdtoOutput;
                   const data:any = colaborador;
                    this.tree_childre.id = data.id;
                    this.tree_childre.name = data.name;
                    this.tree_childre.label = data.charge;
                    this.tree_childre.email = data.email;
                    this.tree_childre.status = data.status;
                    this.tree_childre.role = data.role;
                    this.tree_childre.createdAt = data.createdAt;
                    this.tree_childre.data = new UserRegisterdtoOutput;
                    this.tree_childre.data.name = data.name;
                    this.tree_childre.data.avatar= data.avatar;
                    this.tree_childre.children = [];
                    this.tree_pather.children.push(this.tree_childre);                
                });
            }else{
                return [];
            }
          
            return this.tree_pather;


        } catch (error) {
            return [];
        }
    }   


}
