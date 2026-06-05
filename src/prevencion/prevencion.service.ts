import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActividadQueryDto, QuejaQueryDto } from './dto';
import { ActividadRegisterInput, QuejaRegisterInput, ActividadUpdateInput, QuejaUpdateInput } from './inputs';

@Injectable()
export class PrevencionService {
  constructor(
    @InjectModel('Actividad')
    private readonly actividadModel: Model<ActividadQueryDto>,
    @InjectModel('Queja')
    private readonly quejaModel: Model<QuejaQueryDto>,
  ) {}

  async saveActividad(
    input: ActividadRegisterInput,
    entePublicoId: string,
  ): Promise<ActividadQueryDto> {
    const createdActividad = new this.actividadModel({
      ...input,
      ente_publico: entePublicoId,
    });
    const saved = await createdActividad.save();
    return await saved.populate('ente_publico');
  }

  async addEvidencia(
    actividadId: string,
    input: any,
  ): Promise<ActividadQueryDto> {
    return await this.actividadModel
      .findByIdAndUpdate(
        actividadId,
        { $push: { evidencias: input } },
        { new: true },
      )
      .populate('ente_publico');
  }

  async saveQueja(
    input: QuejaRegisterInput,
    entePublicoId: string,
  ): Promise<QuejaQueryDto> {
    const createdQueja = new this.quejaModel({
      ...input,
      ente_publico: entePublicoId,
    });
    const saved = await createdQueja.save();
    return await saved.populate('ente_publico');
  }

  async updateActividad(
    id: string,
    input: ActividadUpdateInput,
  ): Promise<ActividadQueryDto> {
    return await this.actividadModel
      .findByIdAndUpdate(id, { ...input }, { new: true })
      .populate('ente_publico');
  }

  async deleteActividad(id: string): Promise<ActividadQueryDto> {
    return await this.actividadModel
      .findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
      .populate('ente_publico');
  }

  async updateQueja(
    id: string,
    input: QuejaUpdateInput,
  ): Promise<QuejaQueryDto> {
    return await this.quejaModel
      .findByIdAndUpdate(id, { ...input }, { new: true })
      .populate('ente_publico');
  }

  async deleteQueja(id: string): Promise<QuejaQueryDto> {
    return await this.quejaModel
      .findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
      .populate('ente_publico');
  }


  async getActividades(): Promise<ActividadQueryDto[]> {
    return await this.actividadModel
      .find({ status: 'active' })
      .populate('ente_publico')
      .exec();
  }

  async getQuejas(): Promise<QuejaQueryDto[]> {
    return await this.quejaModel
      .find({ status: 'active' })
      .populate('ente_publico')
      .exec();
  }
}
