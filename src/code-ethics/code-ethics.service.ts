import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeEthicsRegisterDto } from './dto/code-ethics-register.dto';
import { CodeEthicsDeleteInput } from './inputs/code-ethics-delete.input';
import { CodeEthicsRegisterInput } from './inputs/code-ethics-register.input';
import { CodeEthicsUpdateInput } from './inputs/code-ethics-update.input';

@Injectable()
export class CodeEthicsService {

    constructor(
        @InjectModel('CodeEthics') private readonly codeModel: Model<CodeEthicsRegisterDto>
    ) {}
    

   async addCodeEthics(params:CodeEthicsRegisterInput): Promise<CodeEthicsRegisterDto> {
    const crateCodeEthics = new this.codeModel(params);
    const save = crateCodeEthics.save();
    return save;    
    }

    async getCodeEthics(): Promise<CodeEthicsRegisterDto[]>{
        return await this.codeModel.find({ status:'active' }).exec();
    }

    async getCodeEthicById(id: string): Promise<CodeEthicsRegisterDto>{
        return await this.codeModel.findById(id).exec();
    }

    async getCodeEthicByEnte(ente_publico: string): Promise<CodeEthicsRegisterDto>{
        try {
        ente_publico=ente_publico.trim();
        const cdEthics = await this.codeModel.findOne({ente_publico,status:'active'});
        if(cdEthics){
            return cdEthics;
        }else{
            throw new NotFoundException(`El ente público aún no carga su código de ética ;-)`);
        }
        } catch (error) {
            throw new NotFoundException(`El ente público aún no carga su código de ética  ;-)`);
        }        
    }

    async updateCodeEthics(uce:CodeEthicsUpdateInput): Promise<CodeEthicsRegisterDto> {
        const {id, ...updateData} = uce; 
        return await this.codeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async deleteEthicCode(cedi:CodeEthicsDeleteInput): Promise<CodeEthicsRegisterDto>{
        const { id } = cedi;
        return await this.codeModel.findByIdAndUpdate(id,{status: 'inactive'}, {new: true}).exec();

    }

}
