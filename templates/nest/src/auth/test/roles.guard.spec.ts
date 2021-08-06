import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { UsersRole } from 'src/modules/users/users.constants';
import { RolesGuard } from '../guards/roles.guard';
import IJwtPayload from '../payloads/jwt-payload';

describe('RolesGuard', () => {
  let reflector: Reflector;
  let rolesGuard: RolesGuard;

  const mockExecutionContext = ({
    switchToHttp: jest.fn(),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown) as ExecutionContext;

  const getRequest = jest.fn();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule],
    }).compile();

    reflector = moduleRef.get<Reflector>(Reflector);
    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should get the correct role', () => {
      const inputs = [
        [UsersRole.ADMIN],
        [UsersRole.USER],
        [UsersRole.USER],
        [UsersRole.USER],
        [UsersRole.ADMIN, UsersRole.USER],
      ];
      const usersParam = [
        UsersRole.ADMIN,
        UsersRole.ADMIN,
        UsersRole.ADMIN,
        UsersRole.USER,
        UsersRole.USER,
      ];
      const outputs = [true, false, false, true, true];
      for (let index = 0; index < inputs.length; index++) {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockImplementation(() => inputs[index]);
        const mockUser: IJwtPayload = {
          email: null,
          role: usersParam[index],
        };
        const mockGetRequestResult = {
          user: mockUser,
        };
        getRequest.mockImplementation(() => mockGetRequestResult);
        jest
          .spyOn(mockExecutionContext, 'switchToHttp')
          .mockImplementation(() => ({
            getRequest,
            getResponse: null,
            getNext: null,
          }));
        const result = rolesGuard.canActivate(mockExecutionContext);
        expect(result).toBe(outputs[index]);
      }
    });

    it('should return true if not required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => null);
      const result = rolesGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });
});
