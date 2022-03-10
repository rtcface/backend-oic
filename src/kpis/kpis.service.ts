import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KpisRegisterDto } from './dto/kpis-register.dto';
import { KpisRegisterInput } from './inputs/kpis-register.input';
import { KpisUpdateInput } from './inputs/kpis-update.input';

@Injectable()
export class KpisService {

    constructor( 
        @InjectModel('Kpis') private readonly kpisModel: Model<KpisRegisterDto>,
    ) {}
       
    async addKpis(inputCreateKpis: KpisRegisterInput): Promise<KpisRegisterDto> {
        const createdKpis = new this.kpisModel(inputCreateKpis);
        return await createdKpis.save();
    }

    async cargaMasivaKpis(inputCreateKpis: KpisRegisterInput[]):
        Promise<KpisRegisterDto[]> {
        const kpis = inputCreateKpis.map(kpis => new this.kpisModel(kpis));

        if (kpis.length > 0) {
            return await this.kpisModel.insertMany(kpis);
        }

        return [];
    }

    async getKpis(): Promise<KpisRegisterDto[]> {
        return await this.kpisModel.find({ status:'active' }).exec();
    }

    async getKpisById(id: string): Promise<KpisRegisterDto> {
        return await this.kpisModel.findById(id).exec();
    }

    async updateKpis(id: string, inputUpdateKpis: KpisUpdateInput): Promise<KpisRegisterDto> {
        return await this.kpisModel.findByIdAndUpdate(id, inputUpdateKpis, { new: true }).exec();
    }

    async inactivateKpis(id: string): Promise<KpisRegisterDto> {
        return await this.kpisModel.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
    }

}
