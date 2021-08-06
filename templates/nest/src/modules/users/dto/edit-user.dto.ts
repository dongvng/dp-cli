import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class EditUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {}
