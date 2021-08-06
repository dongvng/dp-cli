import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { UsersRole } from '../users.constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsIn([UsersRole.ADMIN, UsersRole.USER])
  role: UsersRole;
}
