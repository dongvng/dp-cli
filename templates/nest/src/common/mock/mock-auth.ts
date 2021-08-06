import AuthCreadentialsDto from 'src/auth/dto/auth-credentials.dto';

export const mockJwtService = {
  signAsync: jest.fn(),
};

export const mockAuthCredentialsDto: AuthCreadentialsDto = {
  email: 'example@test.com',
  password: '123456@Abc',
};

export const mockAuthService = {
  signIn: jest.fn(),
};
