import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class AuthCreadentialsDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email.',
    example: 'example@test.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password.',
    example: '123456@Abc',
  })
  password: string;
}
