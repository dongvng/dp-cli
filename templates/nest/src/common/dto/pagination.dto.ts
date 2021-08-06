import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { DefaultPagination } from '../constants/common.constants';

export class CommonPaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ default: DefaultPagination.PAGE })
  @IsNotEmpty()
  @IsNumberString({})
  page: string;

  @ApiProperty({ default: DefaultPagination.PAGE_SIZE })
  @IsNotEmpty()
  @IsNumberString()
  pageSize: string;
}
