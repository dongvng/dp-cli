import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { EditUserDto } from './dto/edit-user.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

import { UsersMessage } from './users.constants';
import { CommonError } from 'src/common/constants/common.constants';
import { GetUsersDto } from './dto/get-users.dto';
import { commonUpdate } from 'src/common/helper/common-update';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponsePagination } from 'src/common/dto/response-pagination.dto';
import { DeleteResult } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Get all users.
   */
  async getUsers(
    getUsersDto: GetUsersDto,
  ): Promise<ResponsePagination<UserEntity>> {
    return this.usersRepository.getUsers(getUsersDto);
  }

  /**
   * Get an User by ID.
   * @param id User ID.
   */
  async getById(id: string, req: Request): Promise<UserEntity> {
    const { url } = req;
    const redisResult = await this.redisService.getObject<UserEntity>(url);
    if (redisResult) {
      return redisResult;
    }
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(CommonError.NOT_FOUND_USER);
    }
    await this.redisService.set(url, user, { ttl: 20 });
    return user;
  }

  /**
   * Get an user by email.
   * @param email User email.
   */
  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  /**
   * Update an user by ID.
   * @param id User ID.
   * @param editUserDto EditUserDto.
   */
  async update(id: string, editUserDto: EditUserDto): Promise<UserEntity> {
    const { password } = editUserDto;
    let existUser = await this.usersRepository.findOne(id);
    if (!existUser) {
      throw new NotFoundException(CommonError.NOT_FOUND_USER);
    }
    existUser = commonUpdate(existUser, editUserDto);
    if (password) {
      // If edit password, hash this password and save.
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      existUser.salt = salt;
      existUser.password = hashPassword;
    }
    await existUser.save();
    return existUser;
  }

  /**
   * Create a new user.
   * @param createUserDto CreateUserDto.
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { password, email, name, role } = createUserDto;

    // Create new user and save.
    const newUser = new UserEntity();
    newUser.email = email;
    newUser.name = name;
    newUser.role = role;
    // Hash password.
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    newUser.salt = salt;
    newUser.password = hashPassword;

    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate email.
        throw new ConflictException(UsersMessage.EMAIL_EXIST);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUserById(id: string): Promise<DeleteResult> {
    const result = await this.usersRepository.delete(id);
    if (result.affected !== 1) {
      throw new NotFoundException(CommonError.NOT_FOUND_USER);
    }
    return result;
  }
}
