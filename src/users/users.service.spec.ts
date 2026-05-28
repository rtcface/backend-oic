import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserModel = {
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  exec: jest.fn(),
  populate: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: { ...mockUserModel },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create and save a new user', async () => {
      const input = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      };
      const savedUser = { ...input, id: '1' };
      const mockSave = jest.fn().mockResolvedValue(savedUser);
      (service as any).usersModel = function (input: any) {
        return { ...input, save: mockSave };
      };
      const result = await service.register(input as any);
      expect(result).toEqual(savedUser);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('addColaborador', () => {
    it('should add a collaborator to a user', async () => {
      const userId = 'userId';
      const colaboradorId = 'colabId';
      const updatedUser = { id: userId, colaboradores: [colaboradorId] };
      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });
      const result = await service.addColaborador(userId, colaboradorId);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $push: { colaboradores: colaboradorId } },
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });
    it('should throw InternalServerErrorException on error', async () => {
      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('fail')),
      });
      await expect(service.addColaborador('id', 'colab')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('registerColaborador', () => {
    it('should create a collaborator and add to parent', async () => {
      const input = {
        name: 'Colab',
        email: 'colab@example.com',
        parentId: 'parent',
        id: 'child',
      };
      const savedUser = { ...input, id: 'child' };
      const mockSave = jest.fn().mockResolvedValue(savedUser);
      (service as any).usersModel = function (input: any) {
        return { ...input, id: 'child', save: mockSave };
      };
      const addColaboradorSpy = jest
        .spyOn(service, 'addColaborador')
        .mockResolvedValue({} as any);
      const result = await service.registerColaborador(input as any);
      expect(addColaboradorSpy).toHaveBeenCalledWith('parent', 'child');
      expect(result).toEqual(savedUser);
    });
    it('should throw InternalServerErrorException on error', async () => {
      (service as any).usersModel = function () {
        throw new Error('fail');
      };
      await expect(service.registerColaborador({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('registerContralor', () => {
    it('should create a contralor user', async () => {
      const input = { name: 'Contralor', email: 'contralor@example.com' };
      const savedUser = { ...input, id: '2' };
      const mockSave = jest.fn().mockResolvedValue(savedUser);
      (service as any).usersModel = function (input: any) {
        return { ...input, save: mockSave };
      };
      const result = await service.registerContralor(input as any);
      expect(result).toEqual(savedUser);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('registerAdmin', () => {
    it('should create an admin user', async () => {
      const input = { name: 'Admin', email: 'admin@example.com' };
      const savedUser = { ...input, id: '3' };
      const mockSave = jest.fn().mockResolvedValue(savedUser);
      (service as any).usersModel = function (input: any) {
        return { ...input, save: mockSave };
      };
      const result = await service.registerAdmin(input as any);
      expect(result).toEqual(savedUser);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should return all active users without passwords', async () => {
      const users = [
        { id: '1', name: 'A', password: 'secret' },
        { id: '2', name: 'B', password: 'secret' },
      ];
      userModel.find.mockReturnValue({
        where: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(users) }),
      });
      const result = await service.getUsers();
      expect(result).toEqual(users);
    });
  });

  describe('findUserByEmail', () => {
    it('should find an active user by email', async () => {
      const user = { id: '1', email: 'test@example.com', status: 'active' };
      userModel.findOne.mockResolvedValue(user);
      const result = await service.findUserByEmail('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
        status: 'active',
      });
      expect(result).toEqual(user);
    });
  });

  describe('findUserByEmailGeneral', () => {
    it('should find a user by email regardless of status', async () => {
      const user = { id: '1', email: 'test@example.com' };
      userModel.findOne.mockResolvedValue(user);
      const result = await service.findUserByEmailGeneral('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(user);
    });
  });

  describe('findUserByEnte', () => {
    it('should find contralor users by ente', async () => {
      const users = [
        { id: '1', ente: 'ente', status: 'active', role: 'contralor' },
      ];
      userModel.find.mockResolvedValue(users);
      const result = await service.findUserByEnte('ente');
      expect(userModel.find).toHaveBeenCalledWith({
        ente: 'ente',
        status: 'active',
        role: 'contralor',
      });
      expect(result).toEqual(users);
    });
  });

  describe('updateUser', () => {
    it('should update a user and hash the password', async () => {
      const user = { id: '1', password: 'plain' };
      const hashed = 'hashed';
      jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue('salt');
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashed);
      userModel.findByIdAndUpdate.mockResolvedValue({
        ...user,
        password: hashed,
      } as any);
      const result = await service.updateUser(user as any);
      if (
        typeof result === 'object' &&
        result !== null &&
        'password' in result
      ) {
        expect((result as any).password).toBe(hashed);
      } else {
        fail('Result does not have password property');
      }
    });
  });

  describe('changePassword', () => {
    it('should update a user password and set firstSignIn', async () => {
      const input = { id: '1', password: 'newpass' };
      const updated = { id: '1', password: 'newpass', firstSignIn: true };
      userModel.findByIdAndUpdate.mockResolvedValue(updated);
      const result = await service.changePassword(input as any);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { password: 'newpass', firstSignIn: true },
        { new: true },
      );
      expect(result).toEqual(updated);
    });
  });

  describe('updateUserColaborador', () => {
    it('should update a collaborator user and return UserTokenDto', async () => {
      const user = { id: '1', name: 'Colab' };
      userModel.findByIdAndUpdate.mockResolvedValue(user);
      const result = await service.updateUserColaborador(user as any);
      expect(result.haveError).toBe(false);
      expect(result.user).toEqual(user);
    });
    it('should return error UserTokenDto if user not found', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue(null);
      const result = await service.updateUserColaborador({
        id: 'notfound',
      } as any);
      expect(result.haveError).toBe(true);
      expect(result.user).toBeNull();
    });
    it('should throw InternalServerErrorException on error', async () => {
      userModel.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(
        service.updateUserColaborador({ id: 'fail' } as any),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('inactivateUser', () => {
    it('should set a user status to inactive', async () => {
      const user = { id: '1', status: 'inactive' };
      userModel.findByIdAndUpdate.mockResolvedValue(user);
      const result = await service.inactivateUser({ id: '1' } as any);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { status: 'inactive' },
        { new: true },
      );
      expect(result).toEqual(user);
    });
  });

  describe('activateUser', () => {
    it('should set a user status to active', async () => {
      const user = { id: '1', status: 'active' };
      userModel.findByIdAndUpdate.mockResolvedValue(user);
      const result = await service.activateUser('1');
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { status: 'active' },
        { new: true },
      );
      expect(result).toEqual(user);
    });
  });

  describe('findUserByRefreshToken', () => {
    it('should find a user by refresh token', async () => {
      const user = { id: '1', refreshToken: 'token' };
      userModel.findOne.mockResolvedValue(user);
      const result = await service.findUserByRefreshToken('token');
      expect(userModel.findOne).toHaveBeenCalledWith({ refreshToken: 'token' });
      expect(result).toEqual(user);
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      const user = { id: '1' };
      userModel.findById.mockResolvedValue(user);
      service['usersModel'].findById = userModel.findById;
      const result = await service.findUserById('1');
      expect(result).toEqual(user);
    });
  });

  describe('getColaboradores', () => {
    it('should return a tree structure of collaborators', async () => {
      const user = {
        id: '1',
        charge: 'Manager',
        name: 'Boss',
        email: 'boss@example.com',
        status: 'active',
        role: 'contralor',
        phone: '123',
        createdAt: new Date(),
        avatar: 'avatar',
        colaboradores: [
          {
            id: '2',
            name: 'Colab',
            charge: 'Staff',
            email: 'colab@example.com',
            status: 'active',
            role: 'user',
            phone: '456',
            createdAt: new Date(),
            avatar: 'avatar2',
          },
        ],
      };
      userModel.findById = jest.fn().mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) }),
      });
      const input = { boss: '1', ente: undefined };
      service['usersModel'].findById = userModel.findById;
      const result = await service.getColaboradores(input as any);
      if (Array.isArray(result)) {
        fail('Expected a tree object, got array');
      } else {
        expect(result).toBeDefined();
        expect(result.id).toBe('1');
        expect(result.children.length).toBe(1);
      }
    });
    it('should return [] if no collaborators', async () => {
      const user = { colaboradores: [] };
      userModel.findById = jest.fn().mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) }),
      });
      const input = { boss: '1', ente: undefined };
      service['usersModel'].findById = userModel.findById;
      const result = await service.getColaboradores(input as any);
      expect(result).toEqual([]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      userModel.findById = jest.fn().mockImplementation(() => {
        throw new Error('fail');
      });
      const input = { boss: '1', ente: undefined };
      service['usersModel'].findById = userModel.findById;
      await expect(service.getColaboradores(input as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
