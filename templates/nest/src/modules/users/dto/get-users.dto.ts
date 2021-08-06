import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CommonPaginationDto } from 'src/common/dto/pagination.dto';
import { UsersRole } from '../users.constants';

export class GetUsersDto extends CommonPaginationDto {
  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @IsIn([UsersRole.ADMIN, UsersRole.USER])
  role?: UsersRole;
}
