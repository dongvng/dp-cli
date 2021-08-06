import { Test } from '@nestjs/testing';
import {
  mockAuthCredentialsDto,
  mockAuthService,
} from 'src/common/mock/mock-auth';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import TokenResponseDto from '../dto/token-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should call service signIn', async () => {
      expect(authService.signIn).not.toHaveBeenCalled();
      await authController.signIn(mockAuthCredentialsDto);
      expect(authService.signIn).toHaveBeenCalledWith(mockAuthCredentialsDto);
    });

    it('should return the result of service signIn', async () => {
      const result = new TokenResponseDto();
      result.jwtAccessToken = 'aaa';
      jest.spyOn(authService, 'signIn').mockImplementation(async () => result);
      expect(await authController.signIn(mockAuthCredentialsDto)).toBe(result);
    });
  });
});
