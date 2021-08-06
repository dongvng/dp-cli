import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { ResponsePagination } from 'src/common/dto/response-pagination.dto';
import * as CommonUpdate from 'src/common/helper/common-update';
import { mockRedisService } from 'src/common/mock/mock-redis';
import { mockUsersRepository } from 'src/common/mock/mock-users';
import { RedisService } from 'src/modules/redis/redis.service';
import { EditUserDto } from '../dto/edit-user.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { UserEntity } from '../user.entity';
import { UsersRole } from '../users.constants';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { DeleteResult } from 'typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let redisService: RedisService;

  const mockUser = new UserEntity();
  mockUser.email = 'test@gmail.com';
  mockUser.name = 'test';
  mockUser.password = '123lhHKJLHL@#AAUB';
  mockUser.role = UsersRole.USER;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    redisService = moduleRef.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getUsers', () => {
    it('should call usersRepostory getUsers', async () => {
      const result = new ResponsePagination<UserEntity>();
      const mockGetUserDto: GetUsersDto = {
        page: '1',
        pageSize: '10',
        role: null,
        search: null,
      };
      jest
        .spyOn(usersRepository, 'getUsers')
        .mockImplementation(async () => result);
      expect(usersRepository.getUsers).not.toHaveBeenCalled();
      expect(await usersService.getUsers(mockGetUserDto)).toBe(result);
      expect(usersRepository.getUsers).toHaveBeenCalledWith(mockGetUserDto);
    });
  });

  describe('getById', () => {
    const mockId = '123';
    const mockRequest = { url: 'getUser/123' } as Request;
    it('should get return the cached instance if there is one', async () => {
      jest.spyOn(redisService, 'getObject').mockResolvedValue(mockUser);
      expect(redisService.getObject).not.toHaveBeenCalled();
      expect(await usersService.getById(mockId, mockRequest)).toBe(mockUser);
      expect(redisService.getObject).toBeCalledWith(mockRequest.url);
    });

    it('should return record in db if no cached instance', async () => {
      jest.spyOn(redisService, 'getObject').mockResolvedValue(null);
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => mockUser);
      expect(usersRepository.findOne).not.toHaveBeenCalled();
      expect(await usersService.getById(mockId, mockRequest)).toBe(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith(mockId);
    });

    it('should throw exception if not found user', async () => {
      jest
        .spyOn(redisService, 'getObject')
        .mockImplementation(async () => null);
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => null);
      expect(usersService.getById(mockId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update cached if there is not one', async () => {
      jest
        .spyOn(redisService, 'getObject')
        .mockImplementation(async () => null);
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => mockUser);
      expect(redisService.set).not.toHaveBeenCalled();
      expect(await usersService.getById(mockId, mockRequest)).toBe(mockUser);
      expect(redisService.set).toHaveBeenCalledWith(mockRequest.url, mockUser, {
        ttl: 20,
      });
    });
  });

  describe('getByEmail', () => {
    const mockEmail = mockUser.email;
    it('should return null if there is no user with given email', async () => {
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => null);
      expect(usersRepository.findOne).not.toHaveBeenCalled();
      expect(await usersService.getByEmail(mockEmail)).toBe(null);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        email: mockEmail,
      });
    });

    it('should return null if there is no user with given email', async () => {
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => mockUser);
      expect(usersRepository.findOne).not.toHaveBeenCalled();
      expect(await usersService.getByEmail(mockEmail)).toBe(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        email: mockEmail,
      });
    });
  });

  describe('update', () => {
    const mockId = '123';
    const mockEditUserDto: EditUserDto = {
      name: 'example',
      password: '123456@Abc',
      role: UsersRole.USER,
    };
    it('should throw exception if not found user', async () => {
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => null);
      expect(usersService.update(mockId, mockEditUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call commonUpdate', async () => {
      jest.spyOn(mockUser, 'save').mockImplementation(async () => mockUser);
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => mockUser);
      jest
        .spyOn(CommonUpdate, 'commonUpdate')
        .mockImplementation(() => mockUser);
      const result = CommonUpdate.commonUpdate(mockUser, mockEditUserDto);
      expect(await usersService.update(mockId, mockEditUserDto)).toBe(result);
      expect(CommonUpdate.commonUpdate).toHaveBeenCalledWith(
        mockUser,
        mockEditUserDto,
      );
    });

    const mockSalt = '12345Abc';
    const mockGenPass = '12345AbcEFcg';

    it('should call bcrypt functions', async () => {
      jest.spyOn(mockUser, 'save').mockImplementation(async () => mockUser);
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementation(async () => mockUser);
      jest
        .spyOn(CommonUpdate, 'commonUpdate')
        .mockImplementation(() => mockUser);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(mockSalt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockGenPass);
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await usersService.update(mockId, mockEditUserDto);
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockEditUserDto.password,
        mockSalt,
      );
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('salt');
      expect(result.password).toEqual(mockGenPass);
      expect(result.salt).toEqual(mockSalt);
    });

    it('should not call bcrypt if no password', async () => {
      delete mockEditUserDto.password;
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(mockSalt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockGenPass);
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser);
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      await usersService.update(mockId, mockEditUserDto);
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const mockCreateUserDto: CreateUserDto = {
      name: 'example',
      email: 'example@test.com',
      password: '123456@Abc',
      role: UsersRole.USER,
    };
    const mockSalt = '12345Abc';
    const mockGenPass = '12345AbcEFcg';
    it('should call bcrypt functions', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(mockSalt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockGenPass);
      jest
        .spyOn(usersRepository, 'save')
        .mockImplementation(async () => mockUser);
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await usersService.create(mockCreateUserDto);
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('salt');
      expect(result.password).toEqual(mockGenPass);
      expect(result.salt).toEqual(mockSalt);
    });

    it('should throw an exception if email already exist', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(async () => mockSalt);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => mockGenPass);
      jest.spyOn(usersRepository, 'save').mockRejectedValue({ code: '23505' });
      expect(usersService.create(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an internal server exception if error uncaught', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(async () => mockSalt);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => mockGenPass);
      jest.spyOn(usersRepository, 'save').mockRejectedValue({ code: '12345' });
      expect(usersService.create(mockCreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteUserById', () => {
    const mockId = '123';
    it('should call usersRepository delete', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: null };
      jest.spyOn(usersRepository, 'delete').mockResolvedValue(deleteResult);
      expect(usersRepository.delete).not.toHaveBeenCalled();
      const result = await usersService.deleteUserById(mockId);
      expect(usersRepository.delete).toHaveBeenCalledWith(mockId);
      expect(result).toBe(deleteResult);
    });

    it('should throw an error if nout found id', async () => {
      jest
        .spyOn(usersRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: null });
      expect(usersService.deleteUserById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
