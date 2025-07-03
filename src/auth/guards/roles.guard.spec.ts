import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;
    let mockGqlContext: any;

    beforeEach(() => {
      mockGqlContext = {
        getContext: jest.fn().mockReturnValue({
          req: {
            user: null,
          },
        }),
      };

      mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        getType: jest.fn(),
        switchToHttp: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
      } as any;

      jest
        .spyOn(GqlExecutionContext, 'create')
        .mockReturnValue(mockGqlContext as any);
    });

    it('should return true when no roles are required', () => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      const requiredRoles = ['admin'];
      const user = { role: 'admin' };

      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(requiredRoles);
      mockGqlContext.getContext.mockReturnValue({
        req: { user },
      });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should return true when user has one of the required roles', () => {
      const requiredRoles = ['admin', 'contralor'];
      const user = { role: 'contralor' };

      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(requiredRoles);
      mockGqlContext.getContext.mockReturnValue({
        req: { user },
      });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const requiredRoles = ['admin'];

      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(requiredRoles);
      mockGqlContext.getContext.mockReturnValue({
        req: { user: null },
      });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User not authenticated',
      );
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      const requiredRoles = ['admin'];
      const user = { role: 'user' };

      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(requiredRoles);
      mockGqlContext.getContext.mockReturnValue({
        req: { user },
      });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        "User with role 'user' does not have permission to access this resource. Required roles: admin",
      );
    });

    it('should throw ForbiddenException when user role does not match any required role', () => {
      const requiredRoles = ['admin', 'contralor'];
      const user = { role: 'user' };

      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(requiredRoles);
      mockGqlContext.getContext.mockReturnValue({
        req: { user },
      });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        "User with role 'user' does not have permission to access this resource. Required roles: admin, contralor",
      );
    });
  });
});
