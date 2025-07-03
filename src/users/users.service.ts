import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  UserRegisterdto,
  UserUpdatedto,
  UserRegisterdtoOutput,
  UserTokenDto,
} from './dto';

import {
  UserRegisterInput,
  UserUpdateInput,
  UserContralorRegisterInput,
  UserAdminRegisterInput,
  UserColaboradorRegisterInput,
  UserColaboradoresQueryInput,
  UserUpdateColaboradorInput,
  UserDeleteInput,
  UserUpdateChangePassword,
} from './inputs';

/**
 * Service for user management and persistence logic.
 */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService.
   * @param usersModel The user model dependency
   */
  constructor(
    @InjectModel('User') private readonly usersModel: Model<UserRegisterdto>,
  ) {}

  /**
   * Registers a new user.
   * @param inputUser The user registration input
   * @returns The registered user
   */
  async register(inputUser: UserRegisterInput): Promise<UserRegisterdto> {
    const createdUser = new this.usersModel(inputUser);
    return await createdUser.save();
  }

  /**
   * Adds a collaborator to a user.
   * @param id The user ID
   * @param colaborador The collaborator ID
   * @returns The updated user
   */
  async addColaborador(
    id: string,
    colaborador: string,
  ): Promise<UserRegisterdto> {
    try {
      return await this.usersModel
        .findByIdAndUpdate(
          id,
          { $push: { colaboradores: colaborador } },
          { new: true },
        )
        .exec();
    } catch (error) {
      //console.log(error);
      throw new InternalServerErrorException(
        'Unexpected error in UsersService',
        error,
      );
    }
  }

  /**
   * Registers a new collaborator user.
   * @param inputUser The collaborator registration input
   * @returns The registered user
   */
  async registerColaborador(
    inputUser: UserColaboradorRegisterInput,
  ): Promise<UserRegisterdto> {
    try {
      const createdUser = new this.usersModel(inputUser);
      const children = createdUser.id;
      const parent = inputUser.parentId;

      await this.addColaborador(parent, children);

      return await createdUser.save();
    } catch (error) {
      //console.log(error);
      throw new InternalServerErrorException(
        'Unexpected error in UsersService',
        error,
      );
    }
  }

  /**
   * Registers a new contralor user.
   * @param inputUser The contralor registration input
   * @returns The registered user
   */
  async registerContralor(
    inputUser: UserContralorRegisterInput,
  ): Promise<UserRegisterdto> {
    const createdUser = new this.usersModel(inputUser);
    return await createdUser.save();
  }

  /**
   * Registers a new admin user.
   * @param inputUser The admin registration input
   * @returns The registered user
   */
  async registerAdmin(
    inputUser: UserAdminRegisterInput,
  ): Promise<UserRegisterdto> {
    const createdUser = new this.usersModel(inputUser);
    return await createdUser.save();
  }

  /**
   * Gets all active users.
   * @returns An array of active users
   */
  async getUsers(): Promise<UserRegisterdto[]> {
    const users = await this.usersModel
      .find()
      .where({ status: 'active' })
      .exec();
    users.map((user) => {
      delete user.password;
      return user;
    });
    return users;
  }

  /**
   * Finds a user by email (active only).
   * @param email The user's email
   * @returns The found user
   */
  async findUserByEmail(email: string): Promise<UserRegisterdto> {
    return await this.usersModel.findOne({ email: email, status: 'active' });
  }

  /**
   * Finds a user by email (any status).
   * @param email The user's email
   * @returns The found user
   */
  async findUserByEmailGeneral(email: string): Promise<UserRegisterdto> {
    return await this.usersModel.findOne({ email: email });
  }

  /**
   * Finds users by ente (contralor role).
   * @param ente The ente identifier
   * @returns An array of users
   */
  async findUserByEnte(ente: string): Promise<UserRegisterdto[]> {
    return await this.usersModel.find({
      ente: ente,
      status: 'active',
      role: 'contralor',
    });
  }

  /**
   * Updates a user.
   * @param user The user update input
   * @returns The updated user
   */
  async updateUser(user: UserUpdateInput): Promise<UserUpdatedto> {
    const { password } = user;
    user.password = await this.hashePassword(password);
    return await this.usersModel.findByIdAndUpdate(user.id, user, {
      new: true,
    });
  }

  /**
   * Changes a user's password.
   * @param input The password change input
   * @returns The updated user
   */
  async changePassword({
    id,
    password,
  }: UserUpdateChangePassword): Promise<UserUpdatedto> {
    return await this.usersModel.findByIdAndUpdate(
      id,
      { password, firstSignIn: true },
      { new: true },
    );
  }

  /**
   * Updates a collaborator user.
   * @param user The collaborator update input
   * @returns The user token DTO
   */
  async updateUserColaborador(
    user: UserUpdateColaboradorInput,
  ): Promise<UserTokenDto> {
    try {
      const updatedUser = await this.usersModel.findByIdAndUpdate(
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
      //console.log(error);
      throw new InternalServerErrorException(
        'Unexpected error in UsersService',
        error,
      );
    }
  }

  private async hashePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Inactivates a user.
   * @param userDeleteInpu The user delete input
   * @returns The updated user
   */
  async inactivateUser(
    userDeleteInpu: UserDeleteInput,
  ): Promise<UserRegisterdto> {
    return await this.usersModel.findByIdAndUpdate(
      userDeleteInpu.id,
      { status: 'inactive' },
      { new: true },
    );
  }

  /**
   * Activates a user.
   * @param id The user ID
   * @returns The updated user
   */
  async activateUser(id: string): Promise<UserRegisterdto> {
    return await this.usersModel.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true },
    );
  }

  /**
   * Finds a user by refresh token.
   * @param refreshToken The refresh token
   * @returns The found user
   */
  async findUserByRefreshToken(refreshToken: string): Promise<UserRegisterdto> {
    return await this.usersModel.findOne({ refreshToken: refreshToken });
  }

  /**
   * Finds a user by ID.
   * @param id The user ID
   * @returns The found user
   */
  async findUserById(id: string): Promise<UserRegisterdto> {
    return await this.usersModel.findById(id);
  }

  private tree_pather: UserRegisterdtoOutput;
  private tree_childre: UserRegisterdtoOutput;
  private result: UserRegisterdtoOutput[];

  async getColaboradores(
    colaborador: UserColaboradoresQueryInput,
  ): Promise<UserRegisterdtoOutput | []> {
    try {
      const { boss, ente } = colaborador;
      let user;
      if (boss) {
        user = await this.usersModel
          .findById(boss)
          .populate({
            path: 'colaboradores',
            Model: 'User',
            match: { status: 'active' },
          })
          .exec();
      } else {
        user = await this.usersModel
          .findOne({
            $and: [
              { ente_publico: ente },
              { status: 'active' },
              { role: 'contralor' },
            ],
          })
          .populate({
            path: 'colaboradores',
            Model: 'User',
            match: { status: 'active' },
          })
          .exec();
      }

      if (user.colaboradores.length > 0) {
        this.tree_pather = new UserRegisterdtoOutput();

        this.tree_pather.id = user.id;
        this.tree_pather.label = user.charge;
        this.tree_pather.name = user.name;
        this.tree_pather.email = user.email;
        this.tree_pather.status = user.status;
        this.tree_pather.role = user.role;
        this.tree_pather.phone = user.phone;
        this.tree_pather.charge = user.charge;
        this.tree_pather.createdAt = user.createdAt;
        this.tree_pather.data = new UserRegisterdtoOutput();
        this.tree_pather.data.avatar = user.avatar;
        this.tree_pather.data.name = user.name;
        this.tree_pather.children = [];

        user.colaboradores.forEach((colaborador) => {
          this.tree_childre = new UserRegisterdtoOutput();
          const data: any = colaborador;
          this.tree_childre.id = data.id;
          this.tree_childre.name = data.name;
          this.tree_childre.label = data.charge;
          this.tree_childre.email = data.email;
          this.tree_childre.status = data.status;
          this.tree_childre.role = data.role;
          this.tree_childre.phone = data.phone;
          this.tree_childre.charge = data.charge;
          this.tree_childre.createdAt = data.createdAt;
          this.tree_childre.data = new UserRegisterdtoOutput();
          this.tree_childre.data.name = data.name;
          this.tree_childre.data.avatar = data.avatar;
          this.tree_childre.children = [];
          this.tree_pather.children.push(this.tree_childre);
        });
      } else {
        return [];
      }

      return this.tree_pather;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in UsersService',
        error,
      );
    }
  }
}
