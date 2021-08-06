import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import {
  mockAuthCredentialsDto,
  mockJwtService,
} from 'src/common/mock/mock-auth';
import { mockUsersService } from 'src/common/mock/mock-users';
import { UserEntity } from 'src/modules/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { AuthMessage } from '../auth.constants';
import { AuthService } from '../auth.service';
import IJwtPayload from '../payloads/jwt-payload';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should call userService', async () => {
      const user = new UserEntity();
      jest
        .spyOn(usersService, 'getByEmail')
        .mockImplementation(async () => user);
      jest.spyOn(user, 'validatePassword').mockImplementation(async () => true);
      expect(usersService.getByEmail).not.toHaveBeenCalled();
      expect(user.validatePassword).not.toHaveBeenCalled();
      await authService.signIn(mockAuthCredentialsDto);
      expect(usersService.getByEmail).toHaveBeenCalledWith(
        mockAuthCredentialsDto.email,
      );
      expect(user.validatePassword).toHaveBeenCalledWith(
        mockAuthCredentialsDto.password,
      );
    });

    it('should call jwtService', async () => {
      const user = new UserEntity();
      const payload: IJwtPayload = {
        email: mockAuthCredentialsDto.email,
        role: user.role,
      };
      const jwtToken = '';
      jest
        .spyOn(usersService, 'getByEmail')
        .mockImplementation(async () => user);
      jest.spyOn(user, 'validatePassword').mockImplementation(async () => true);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(async () => jwtToken);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
      await authService.signIn(mockAuthCredentialsDto);
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });

    it('should return the correct response', async () => {
      const user = new UserEntity();
      const jwtToken = 'hello';
      const result = {
        jwtAccessToken: jwtToken,
        user,
      };
      jest
        .spyOn(usersService, 'getByEmail')
        .mockImplementation(async () => user);
      jest.spyOn(user, 'validatePassword').mockImplementation(async () => true);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(async () => jwtToken);
      await expect(
        authService.signIn(mockAuthCredentialsDto),
      ).resolves.toStrictEqual(result);
    });

    it('should throw an error for invalid email', async () => {
      jest
        .spyOn(usersService, 'getByEmail')
        .mockImplementation(async () => null);
      await expect(authService.signIn(mockAuthCredentialsDto)).rejects.toThrow(
        new BadRequestException(AuthMessage.INVALID_CREDENTIALS),
      );
    });

    it('should throw an error for invalid credentials', async () => {
      const user = new UserEntity();
      jest
        .spyOn(usersService, 'getByEmail')
        .mockImplementation(async () => user);
      jest
        .spyOn(user, 'validatePassword')
        .mockImplementation(async () => false);
      await expect(authService.signIn(mockAuthCredentialsDto)).rejects.toThrow(
        new BadRequestException(AuthMessage.INVALID_CREDENTIALS),
      );
    });
  });
});
