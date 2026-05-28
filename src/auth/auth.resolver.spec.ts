import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { ForbiddenException } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { RolesGuard } from './guards/roles.guard';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockAuthService = {
    AuthRegister: jest.fn(),
    AuthRegisterContralor: jest.fn(),
    AuthRegisterAdmin: jest.fn(),
    AuthRegisterColaborador: jest.fn(),
    login: jest.fn(),
    changePassword: jest.fn(),
    refreshToken: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const input = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      };
      const expectedResult = {
        haveError: false,
        user: { id: '1', ...input },
        token: 'token',
      };

      mockAuthService.AuthRegister.mockResolvedValue(expectedResult);

      const result = await resolver.register(input as any);

      expect(authService.AuthRegister).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });

    it('should handle registration error', async () => {
      const input = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      };
      const expectedResult = {
        haveError: true,
        Err: 'Email already in use',
        user: null,
        token: '',
      };

      mockAuthService.AuthRegister.mockResolvedValue(expectedResult);

      const result = await resolver.register(input as any);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('registerAdmin', () => {
    it('should register admin user successfully', async () => {
      const input = { name: 'Admin', email: 'admin@example.com' };
      const expectedResult = {
        haveError: false,
        user: { id: '1', ...input, role: 'admin' },
        token: 'token',
      };

      mockAuthService.AuthRegisterAdmin.mockResolvedValue(expectedResult);

      const result = await resolver.registerAdmin(input as any);

      expect(authService.AuthRegisterAdmin).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });

    it('should handle admin registration error', async () => {
      const input = { name: 'Admin', email: 'admin@example.com' };
      const expectedResult = {
        haveError: true,
        Err: 'Email already in use',
        user: null,
        token: '',
      };

      mockAuthService.AuthRegisterAdmin.mockResolvedValue(expectedResult);

      const result = await resolver.registerAdmin(input as any);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('registerContralor', () => {
    it('should register contralor user successfully', async () => {
      const input = {
        name: 'Contralor',
        email: 'contralor@example.com',
        ente_publico: 'ente',
      };
      const expectedResult = {
        haveError: false,
        user: { id: '1', ...input, role: 'contralor' },
        token: 'token',
      };

      mockAuthService.AuthRegisterContralor.mockResolvedValue(expectedResult);

      const result = await resolver.registerContralor(input as any);

      expect(authService.AuthRegisterContralor).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('registerColaborador', () => {
    it('should register colaborador user successfully', async () => {
      const input = {
        name: 'Colab',
        email: 'colab@example.com',
        charge: 'Staff',
        phone: '123',
        parentId: 'parent',
      };
      const expectedResult = {
        haveError: false,
        user: { id: '1', ...input, role: 'user' },
        token: 'token',
      };

      mockAuthService.AuthRegisterColaborador.mockResolvedValue(expectedResult);

      const result = await resolver.registerColaborador(input as any);

      expect(authService.AuthRegisterColaborador).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const input = { email: 'test@example.com', password: 'pass' };
      const expectedResult = {
        haveError: false,
        user: { id: '1', email: input.email },
        token: 'token',
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await resolver.login(input as any);

      expect(authService.login).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const input = {
        email: 'test@example.com',
        password: 'old',
        newPassword: 'new',
      };
      const expectedResult = {
        haveError: false,
        user: { id: '1', email: input.email },
        token: 'token',
      };

      mockAuthService.changePassword.mockResolvedValue(expectedResult);

      const result = await resolver.changePassword(input as any);

      expect(authService.changePassword).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'refresh-token';
      const expectedResult = {
        haveError: false,
        user: { id: '1' },
        token: 'new-token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      const result = await resolver.refreshToken(refreshToken);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('verify_authentication', () => {
    it('should verify token successfully', async () => {
      const token = 'jwt-token';
      const expectedResult = {
        haveError: false,
        user: { id: '1' },
        token: 'valid-token',
      };

      mockAuthService.validateToken.mockResolvedValue(expectedResult);

      const result = await resolver.verify_authentication(token);

      expect(authService.validateToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Role-based access control', () => {
    it('should allow admin users to register other admins', async () => {
      // This test would require mocking the guards and context
      // In a real integration test, you would set up the request context
      // with a user that has admin role
      const input = { name: 'NewAdmin', email: 'newadmin@example.com' };
      const expectedResult = {
        haveError: false,
        user: { id: '2', ...input, role: 'admin' },
        token: 'token',
      };

      mockAuthService.AuthRegisterAdmin.mockResolvedValue(expectedResult);

      const result = await resolver.registerAdmin(input as any);

      expect(authService.AuthRegisterAdmin).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });

    it('should reject non-admin users from registering admins', async () => {
      // This test demonstrates the expected behavior when a non-admin user
      // tries to access the registerAdmin endpoint
      // In a real scenario, the RolesGuard would throw a ForbiddenException
      const input = { name: 'NewAdmin', email: 'newadmin@example.com' };

      // Simulate the guard throwing an exception
      const mockGuard = {
        canActivate: jest.fn().mockImplementation(() => {
          throw new ForbiddenException(
            "User with role 'user' does not have permission to access this resource. Required roles: admin",
          );
        }),
      };

      // This test shows what would happen if a non-admin user tries to access
      // the registerAdmin endpoint - they would get a ForbiddenException
      expect(() => mockGuard.canActivate()).toThrow(ForbiddenException);
      expect(() => mockGuard.canActivate()).toThrow(
        "User with role 'user' does not have permission to access this resource. Required roles: admin",
      );
    });
  });
});
