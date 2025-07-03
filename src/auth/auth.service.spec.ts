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
});
