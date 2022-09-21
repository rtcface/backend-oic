import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRegisterdto, UserTokenCmmDto, UserTokenDto } from 'src/users/dto';
import { UserDeleteInput, UserUpdateColaboradorInput } from 'src/users/inputs';
import { EthicsCommittedtoOutput, EthicsCommitteRegisterdto } from './dto/ethics_committe_register.dto';
import { CommitteColaboradoresQueryInput } from './inputs/ethics_committe_query.input';
import { EthicsCommitteMemberRegisterInput, EthicsCommitteRegisterInput } from './inputs/ethics_committe_register.input';

@Injectable()
export class EthicsCommitteService {

constructor(
@InjectModel('Committe') private readonly committeModel: Model<EthicsCommitteRegisterdto>
) {}

async registerPrecident(inputPrecident: EthicsCommitteRegisterInput): Promise<EthicsCommitteRegisterdto>{
    try {        
        const createdMember = new this.committeModel(inputPrecident);
        return await createdMember.save();
    } catch (error) {
        console.log(error);
        return error;
    }
}

private async addMember(id: string, colaborador: string): Promise<EthicsCommitteRegisterdto> {
    try {
    return await this.committeModel.
    findByIdAndUpdate(id,
         { $push: {colaboradores: colaborador} },
         {new: true}).exec();
    } catch (error) {
        console.log(error);
    }
}

async registerMember (inputUser: EthicsCommitteMemberRegisterInput): 
Promise<EthicsCommitteRegisterdto> {
    try {
        const createdMember = new this.committeModel(inputUser);
        const children = createdMember.id;
        const parent = inputUser.parentId;

        await this.addMember(parent, children);

        return await createdMember.save();
        
    } catch (error) {
        console.log(error);
        return error;
    }
   
}

async updateUserCmmColaborador(user:UserUpdateColaboradorInput): Promise<UserTokenCmmDto> {
    try {      

        const updatedUser = await this.committeModel.findByIdAndUpdate(user.id, user, {new: true});

        if(!updatedUser) {
            return {
                haveError: true,
                Err: 'No se encontro el usuario',
                token: '',
                user: null
            }
        }

        return {
            haveError: false,
            Err: '',
            token: '',
            user: updatedUser
        }

       
        
    } catch (error) {
        console.log(error);
        const userToken = new UserTokenDto();
        userToken.haveError = true;
        userToken.Err = error;
        userToken.token = '';
        userToken.user = null;
        return userToken;
        
    }
   
}


async inactivateUser(userDeleteInpu: UserDeleteInput): Promise<EthicsCommitteRegisterdto> {
    return await this.committeModel.findByIdAndUpdate(userDeleteInpu.id, {status: 'inactive'}, {new: true});
}

async activateUser({ id } : UserDeleteInput): Promise<EthicsCommitteRegisterdto> {
    return await this.committeModel.findByIdAndUpdate(id, {status: 'active'}, {new: true});
}

async findPresidentByEnte(ente: string): Promise<EthicsCommitteRegisterdto> {
    const presidet = await this.committeModel.findOne({ente_publico: ente, status:'active',charge:'Presidente'});

    if(presidet) {
        return presidet;
      } else {        
        throw new NotFoundException(`No encontramos el presidente ${ente}`);
      }
}


tree_pather:EthicsCommittedtoOutput;
tree_childre:EthicsCommittedtoOutput;
result:EthicsCommittedtoOutput[];

async getColaboradores(colaborador:CommitteColaboradoresQueryInput):
    Promise<EthicsCommittedtoOutput | []> {
        try {
            const {boss, ente} = colaborador;
            let user;
            if(boss){
                //console.log("Entro en if");
            user = await this.committeModel.findById(boss)
            .populate(
                {
                    path: 'colaboradores',
                    Model: 'User',
                    match: {status: 'active'}                    
                }
            ).exec();
            }else{
                // console.log('entro en else');
             user = await this.committeModel.findOne({$and:[{ente_publico: ente}, {status:'active'}]})
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

                this.tree_pather = new EthicsCommittedtoOutput;                
           
                this.tree_pather.id = user.id;
                this.tree_pather.label = user.charge;
                this.tree_pather.name = user.name;
                this.tree_pather.email = user.email;              
                this.tree_pather.status = user.status;
                this.tree_pather.role = user.role;
                this.tree_pather.phone = user.phone;
                this.tree_pather.charge = user.charge;    CommitteColaboradoresQueryInput            
                this.tree_pather.createdAt = user.createdAt;
                this.tree_pather.data = new EthicsCommittedtoOutput;
                this.tree_pather.data.avatar = user.avatar;
                this.tree_pather.data.name= user.name;           
                this.tree_pather.children = [];
               

                user.colaboradores.forEach(colaborador => {
                    this.tree_childre = new EthicsCommittedtoOutput;
                   const data:any = colaborador;
                    this.tree_childre.id = data.id;
                    this.tree_childre.name = data.name;
                    this.tree_childre.label = data.charge;
                    this.tree_childre.email = data.email;
                    this.tree_childre.status = data.status;
                    this.tree_childre.role = data.role;
                    this.tree_childre.phone = data.phone;
                    this.tree_childre.charge = data.charge;
                    this.tree_childre.createdAt = data.createdAt;
                    this.tree_childre.data = new EthicsCommittedtoOutput;
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
