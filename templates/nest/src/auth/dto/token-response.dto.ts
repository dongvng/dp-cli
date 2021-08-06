import { UserEntity } from 'src/modules/users/user.entity';

export default class TokenResponseDto {
  jwtAccessToken: string;
  user: UserEntity;
}
