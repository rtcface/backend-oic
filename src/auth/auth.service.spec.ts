import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
            verify: jest.fn().mockReturnValue({ id: 'mocked-user-id' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findUserByEmailGeneral: jest.fn(),
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
            findUserByRefreshToken: jest.fn(),
            register: jest.fn(),
            registerContralor: jest.fn(),
            registerAdmin: jest.fn(),
            registerColaborador: jest.fn(),
            changePassword: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have jwt service', () => {
    expect(jwtService).toBeDefined();
  });

  it('should have users service', () => {
    expect(usersService).toBeDefined();
  });

  describe('AuthRegister', () => {
    it('should register a new user and return token', async () => {
      const input = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      };
      const createdUser = { id: '1', ...input };
      (usersService.findUserByEmailGeneral as jest.Mock).mockResolvedValue(
        null,
      );
      (usersService.register as jest.Mock).mockResolvedValue(createdUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPass');
      const result = await service.AuthRegister(input as any);
      expect(result.haveError).toBe(false);
      expect(result.user).toEqual(createdUser);
      expect(result.token).toBe('mocked-jwt-token');
    });
    it('should return error if user already exists', async () => {
      const input = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      };
      const foundUser = { id: '1', ...input };
      (usersService.findUserByEmailGeneral as jest.Mock).mockResolvedValue(
        foundUser,
      );
      const result = await service.AuthRegister(input as any);
      expect(result.haveError).toBe(true);
      expect(result.user).toEqual(foundUser);
      expect(result.token).toBe('');
    });
  });

  describe('changePassword', () => {
    it('should change password and return token', async () => {
      const input = {
        email: 'test@example.com',
        password: 'old',
        newPassword: 'new',
      };
      const user = { id: '1', email: input.email, password: 'hashedOld' };
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedNew');
      (usersService.changePassword as jest.Mock).mockResolvedValue(true);
      const result = (await service.changePassword(input as any)) as any;
      expect(result.haveError).toBe(false);
      expect(result.user.id).toBe('1');
      expect(result.token).toBe('mocked-jwt-token');
    });
    it('should throw if user not found', async () => {
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(null);
      await expect(
        service.changePassword({
          email: 'x',
          password: 'a',
          newPassword: 'b',
        } as any),
      ).rejects.toThrow();
    });
    it('should throw if password is invalid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedOld',
      };
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      await expect(
        service.changePassword({
          email: 'x',
          password: 'a',
          newPassword: 'b',
        } as any),
      ).rejects.toThrow();
    });
    it('should throw if changePassword fails', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedOld',
      };
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedNew');
      (usersService.changePassword as jest.Mock).mockResolvedValue(false);
      await expect(
        service.changePassword({
          email: 'x',
          password: 'a',
          newPassword: 'b',
        } as any),
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login and return token', async () => {
      const loginInput = { email: 'test@example.com', password: 'pass' };
      const user = { id: '1', email: loginInput.email, password: 'hashed' };
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      const result = await service.login(loginInput as any);
      expect(result.haveError).toBe(false);
      expect(result.user.id).toBe('1');
      expect(result.token).toBe('mocked-jwt-token');
    });
    it('should throw if user not found', async () => {
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login({ email: 'x', password: 'a' } as any),
      ).rejects.toThrow();
    });
    it('should throw if password is invalid', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'hashed' };
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      await expect(
        service.login({ email: 'x', password: 'a' } as any),
      ).rejects.toThrow();
    });
  });
  describe('AuthRegisterContralor', () => {
    it('should register a contralor and return token', async () => {
      const input = { name: 'C', email: 'c@c.com', ente_publico: 'E' };
      const user = { id: '2', ...input };
      (usersService.findUserByEmailGeneral as jest.Mock).mockResolvedValue(null);
      (usersService.registerContralor as jest.Mock).mockResolvedValue(user);
      const res = await service.AuthRegisterContralor(input as any);
      expect(res.haveError).toBe(false);
      expect(res.user.id).toBe('2');
      expect(usersService.registerContralor).toHaveBeenCalled();
    });
    it('should return error if email in use', async () => {
      (usersService.findUserByEmailGeneral as jest.Mock).mockResolvedValue({ id: '1' });
      const res = await service.AuthRegisterContralor({ email: 'c@c.com' } as any);
      expect(res.haveError).toBe(true);
    });
  });

  describe('AuthRegisterAdmin', () => {
    it('should register an admin and return token', async () => {
      const input = { name: 'A', email: 'a@a.com', password: 'P' };
      const user = { id: '3', ...input };
      (usersService.findUserByEmailGeneral as jest.Mock).mockResolvedValue(null);
      (usersService.registerAdmin as jest.Mock).mockResolvedValue(user);
      const res = await service.AuthRegisterAdmin(input as any);
      expect(res.haveError).toBe(false);
      expect(res.user.id).toBe('3');
    });
  });

  describe('AuthRegisterColaborador', () => {
    it('should register a colaborador and return token', async () => {
      const input = { name: 'Col', email: 'col@c.com', charge: 'C', phone: '1', parentId: '1' };
      const user = { id: '4', ...input };
      (usersService.findUserByEmailGeneral as jest.Mock).mockResolvedValue(null);
      (usersService.registerColaborador as jest.Mock).mockResolvedValue(user);
      const res = await service.AuthRegisterColaborador(input as any);
      expect(res.haveError).toBe(false);
      expect(res.user.id).toBe('4');
    });
  });

  describe('validateUser', () => {
    it('should validate user with correct password', async () => {
      const user = { id: '1', email: 'a@a.com', password: 'pass' };
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);
      const res = await service.validateUser('a@a.com', 'pass');
      expect(res).not.toBeNull();
      expect(res?.user.id).toBe('1');
    });
    it('should return null if password incorrect', async () => {
      const user = { id: '1', email: 'a@a.com', password: 'pass' };
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);
      const res = await service.validateUser('a@a.com', 'wrong');
      expect(res).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should return new token if refresh token valid', async () => {
      const user = { id: '1', email: 'a@a.com' };
      (usersService.findUserByRefreshToken as jest.Mock).mockResolvedValue(user);
      const res = await service.refreshToken('rt');
      expect(res.haveError).toBe(false);
      expect(res.token).toBe('mocked-jwt-token');
    });
    it('should throw if refresh token invalid', async () => {
      (usersService.findUserByRefreshToken as jest.Mock).mockResolvedValue(null);
      await expect(service.refreshToken('rt')).rejects.toThrow();
    });
  });

  describe('validateToken', () => {
    it('should validate token and return user', async () => {
      const user = { id: '1', email: 'a@a.com' };
      (usersService.findUserById as jest.Mock).mockResolvedValue(user);
      const res = await service.validateToken('Bearer t');
      expect(res.haveError).toBe(false);
      expect(res.user.id).toBe('1');
    });
    it('should throw if user not found', async () => {
      (usersService.findUserById as jest.Mock).mockResolvedValue(null);
      await expect(service.validateToken('Bearer t')).rejects.toThrow();
    });
    it('should throw if token is invalid', async () => {
      (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('invalid token');
      });
      await expect(service.validateToken('Bearer invalid')).rejects.toThrow('invalid token');
    });
  });
});
