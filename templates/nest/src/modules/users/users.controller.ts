import {
  Get,
  Put,
  Body,
  Controller,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  Post,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ResponsePagination } from 'src/common/dto/response-pagination.dto';
import { DeleteResult } from 'typeorm';
import { Roles } from './decorators/user-roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

import { EditUserDto } from './dto/edit-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UserEntity } from './user.entity';
import { UsersRole, UsersSummary } from './users.constants';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UsersRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: UsersSummary.GET_ALL })
  async get(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<ResponsePagination<UserEntity>> {
    return this.usersService.getUsers(getUsersDto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: UsersSummary.GET_BY_ID })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<UserEntity> {
    return this.usersService.getById(id, req);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: UsersSummary.UPDATE_BY_ID })
  async update(
    @Param('id') id: string,
    @Body() editUserDto: EditUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, editUserDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: UsersSummary.CREAT_USER })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: UsersSummary.DELETE_USER })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteResult> {
    return this.usersService.deleteUserById(id);
  }
}
