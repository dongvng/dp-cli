import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { ResponsePagination } from 'src/common/dto/response-pagination.dto';
import { mockUsersService } from 'src/common/mock/mock-users';
import { DeleteResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { EditUserDto } from '../dto/edit-user.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { UserEntity } from '../user.entity';
import { UsersRole } from '../users.constants';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('get', () => {
    it('should call service getUsers', async () => {
      const result = new ResponsePagination<UserEntity>();
      const mockGetUserDto: GetUsersDto = {
        page: '1',
        pageSize: '10',
        role: null,
        search: null,
      };
      jest
        .spyOn(usersService, 'getUsers')
        .mockImplementation(async () => result);
      expect(usersService.getUsers).not.toHaveBeenCalled();
      expect(await usersController.get(mockGetUserDto)).toBe(result);
      expect(usersService.getUsers).toHaveBeenCalledWith(mockGetUserDto);
    });
  });

  describe('getById', () => {
    it('should call service getById', async () => {
      const result = new UserEntity();
      const mockId = '123';
      const mockReq = {} as Request;
      jest
        .spyOn(usersService, 'getById')
        .mockImplementation(async () => result);
      expect(usersService.getById).not.toHaveBeenCalled();
      expect(await usersController.getById(mockId, mockReq)).toBe(result);
      expect(usersService.getById).toHaveBeenCalledWith(mockId, mockReq);
    });
  });

  describe('update', () => {
    it('should call service update', async () => {
      const result = new UserEntity();
      const mockId = '123';
      const mockEditUserDto: EditUserDto = {
        name: 'example',
        password: '123456@Abc',
        role: UsersRole.USER,
      };
      jest.spyOn(usersService, 'update').mockImplementation(async () => result);
      expect(usersService.update).not.toHaveBeenCalled();
      expect(await usersController.update(mockId, mockEditUserDto)).toBe(
        result,
      );
      expect(usersService.update).toHaveBeenCalledWith(mockId, mockEditUserDto);
    });
  });

  describe('createUser', () => {
    it('should call service create', async () => {
      const result = new UserEntity();
      const mockCreateUserDto: CreateUserDto = {
        name: 'example',
        email: 'example@test.com',
        password: '123456@Abc',
        role: UsersRole.USER,
      };
      jest.spyOn(usersService, 'create').mockImplementation(async () => result);
      expect(usersService.create).not.toHaveBeenCalled();
      expect(await usersController.createUser(mockCreateUserDto)).toBe(result);
      expect(usersService.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should call service deleteUserById', async () => {
      const mockId = '123';
      const result: DeleteResult = {
        affected: 1,
        raw: null,
      };
      jest
        .spyOn(usersService, 'deleteUserById')
        .mockImplementation(async () => result);
      expect(usersService.deleteUserById).not.toHaveBeenCalled();
      expect(await usersController.deleteUser(mockId)).toBe(result);
      expect(usersService.deleteUserById).toHaveBeenCalledWith(mockId);
    });
  });
});
