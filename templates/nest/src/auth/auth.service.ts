import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import IJwtPayload from './payloads/jwt-payload';
import { AuthMessage } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Sign in an user.
   * @param authCredentialsDto AuthCredentialsDto.
   */
  async signIn(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<TokenResponseDto> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersService.getByEmail(email);

    // If user with email exist and the password is valid.
    if (user && (await user.validatePassword(password))) {
      const payload: IJwtPayload = { email, role: user.role };
      const jwtAccessToken = await this.jwtService.signAsync(payload);

      return { jwtAccessToken, user };
    }
    // Else return an error.
    throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
  }
}
