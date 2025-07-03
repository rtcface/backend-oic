import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRegisterdto, UserTokenCmmDto, UserTokenDto } from 'src/users/dto';
import { UserDeleteInput, UserUpdateColaboradorInput } from 'src/users/inputs';
import {
  EthicsCommittedtoOutput,
  EthicsCommitteRegisterdto,
} from './dto/ethics_committe_register.dto';
import { CommitteColaboradoresQueryInput } from './inputs/ethics_committe_query.input';
import {
  EthicsCommitteMemberRegisterInput,
  EthicsCommitteRegisterInput,
} from './inputs/ethics_committe_register.input';

@Injectable()
export class EthicsCommitteService {
  constructor(
    @InjectModel('Committe')
    private readonly committeModel: Model<EthicsCommitteRegisterdto>,
  ) {}

  async registerPrecident(
    inputPrecident: EthicsCommitteRegisterInput,
  ): Promise<EthicsCommitteRegisterdto> {
    try {
      const createdMember = new this.committeModel(inputPrecident);
      return await createdMember.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in EthicsCommitteService',
        error,
      );
    }
  }

  private async addMember(
    id: string,
    colaborador: string,
  ): Promise<EthicsCommitteRegisterdto> {
    try {
      return await this.committeModel
        .findByIdAndUpdate(
          id,
          { $push: { colaboradores: colaborador } },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in EthicsCommitteService',
        error,
      );
    }
  }

  async registerMember(
    inputUser: EthicsCommitteMemberRegisterInput,
  ): Promise<EthicsCommitteRegisterdto> {
    try {
      const createdMember = new this.committeModel(inputUser);
      const children = createdMember.id;
      const parent = inputUser.parentId;

      await this.addMember(parent, children);

      return await createdMember.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in EthicsCommitteService',
        error,
      );
    }
  }

  async updateUserCmmColaborador(
    user: UserUpdateColaboradorInput,
  ): Promise<UserTokenCmmDto> {
    try {
      const updatedUser = await this.committeModel.findByIdAndUpdate(
        user.id,
        user,
        { new: true },
      );

      if (!updatedUser) {
        return {
          haveError: true,
          Err: 'No se encontro el usuario',
          token: '',
          user: null,
        };
      }

      return {
        haveError: false,
        Err: '',
        token: '',
        user: updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in EthicsCommitteService',
        error,
      );
    }
  }

  async inactivateUser(
    userDeleteInpu: UserDeleteInput,
  ): Promise<EthicsCommitteRegisterdto> {
    return await this.committeModel.findByIdAndUpdate(
      userDeleteInpu.id,
      { status: 'inactive' },
      { new: true },
    );
  }

  async activateUser({
    id,
  }: UserDeleteInput): Promise<EthicsCommitteRegisterdto> {
    return await this.committeModel.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true },
    );
  }

  async findPresidentByEnte(ente: string): Promise<EthicsCommitteRegisterdto> {
    const presidet = await this.committeModel.findOne({
      ente_publico: ente,
      status: 'active',
      charge: 'Presidente',
    });

    if (presidet) {
      return presidet;
    } else {
      throw new NotFoundException(`No encontramos el presidente ${ente}`);
    }
  }

  async getColaboradores(
    colaborador: CommitteColaboradoresQueryInput,
  ): Promise<EthicsCommittedtoOutput | []> {
    try {
      const { boss, ente } = colaborador;
      let user;
      if (boss) {
        user = await this.committeModel
          .findById(boss)
          .populate({
            path: 'colaboradores',
            Model: 'Committe',
            match: { status: 'active' },
          })
          .exec();
      } else {
        user = await this.committeModel
          .findOne({ $and: [{ ente_publico: ente }, { status: 'active' }] })
          .populate({
            path: 'colaboradores',
            Model: 'Committe',
            match: { status: 'active' },
          })
          .exec();
      }

      if (user.colaboradores.length > 0) {
        return user.colaboradores.map((colaborador) => {
          const tree = new EthicsCommittedtoOutput();
          tree.id = colaborador.id;
          tree.label = colaborador.charge;
          tree.name = colaborador.name;
          tree.email = colaborador.email;
          tree.status = colaborador.status;
          tree.role = colaborador.role;
          tree.phone = colaborador.phone;
          tree.charge = colaborador.charge;
          tree.createdAt = colaborador.createdAt;
          tree.data = new EthicsCommittedtoOutput();
          tree.data.avatar = colaborador.avatar;
          tree.data.name = colaborador.name;
          tree.children = [];
          return tree;
        });
      } else if (!user) {
        return [];
      }

      return user.colaboradores.map((colaborador) => {
        const tree = new EthicsCommittedtoOutput();
        tree.id = colaborador.id;
        tree.label = colaborador.charge;
        tree.name = colaborador.name;
        tree.email = colaborador.email;
        tree.status = colaborador.status;
        tree.role = colaborador.role;
        tree.phone = colaborador.phone;
        tree.charge = colaborador.charge;
        tree.createdAt = colaborador.createdAt;
        tree.data = new EthicsCommittedtoOutput();
        tree.data.avatar = colaborador.avatar;
        tree.data.name = colaborador.name;
        tree.children = [];
        return tree;
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in EthicsCommitteService',
        error,
      );
    }
  }
}
