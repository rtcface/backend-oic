import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeEthicsRegisterDto } from './dto/code-ethics-register.dto';
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

    async updateCodeEthics(uce:CodeEthicsUpdateInput): Promise<CodeEthicsRegisterDto> {
        const {id, ...updateData} = uce; 
        return await this.codeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

}
