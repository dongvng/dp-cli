import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetUsersDto } from '../dto/get-users.dto';
import { UserEntity } from '../user.entity';
import { UsersRole } from '../users.constants';
import { UsersRepository } from '../users.repository';
import * as CommonPagination from '../../../common/helper/common-pagination';
import { mockQuery } from 'src/common/mock/mock-users';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;

  const mockUser = new UserEntity();
  mockUser.email = 'test@gmail.com';
  mockUser.name = 'test';
  mockUser.password = '123lhHKJLHL@#AAUB';
  mockUser.role = UsersRole.USER;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneById', () => {
    const mockId = '123';
    it('should call this findOne', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      expect(usersRepository.findOne).not.toHaveBeenCalled();
      const result = await usersRepository.findOneById(mockId);
      expect(usersRepository.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toBe(mockUser);
    });

    it('should throw an not found exception if no user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      expect(usersRepository.findOneById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUser', () => {
    jest.spyOn(CommonPagination, 'commonPagination').mockImplementation(null);

    it('should call queryBuilder andWhere if role', async () => {
      const mockGetUserDto: GetUsersDto = {
        page: '1',
        pageSize: '10',
        role: UsersRole.USER,
      };
      jest
        .spyOn(usersRepository, 'createQueryBuilder')
        .mockReturnValue(mockQuery);
      expect(usersRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(mockQuery.addOrderBy).not.toHaveBeenCalled();
      expect(mockQuery.andWhere).not.toHaveBeenCalled();
      await usersRepository.getUsers(mockGetUserDto);
      expect(mockQuery.andWhere).toHaveBeenCalledWith('user.role = :role', {
        role: mockGetUserDto.role,
      });
      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQuery.addOrderBy).toHaveBeenCalledWith(
        'user.createdAt',
        'DESC',
      );
    });

    it('should not call queryBuilder andWhere if not role and search', async () => {
      const mockGetUserDto: GetUsersDto = {
        page: '1',
        pageSize: '10',
      };
      jest
        .spyOn(usersRepository, 'createQueryBuilder')
        .mockReturnValue(mockQuery);
      expect(mockQuery.andWhere).not.toHaveBeenCalled();
      await usersRepository.getUsers(mockGetUserDto);
      expect(mockQuery.andWhere).not.toHaveBeenCalled();
    });

    it('should call queryBuilder andWhere if search', async () => {
      const mockGetUserDto: GetUsersDto = {
        page: '1',
        pageSize: '10',
        search: 'hello',
      };
      jest
        .spyOn(usersRepository, 'createQueryBuilder')
        .mockReturnValue(mockQuery);
      expect(mockQuery.andWhere).not.toHaveBeenCalled();
      await usersRepository.getUsers(mockGetUserDto);
      expect(mockQuery.andWhere).toHaveBeenCalledWith(
        'user.name ILIKE :search',
        { search: `%${mockGetUserDto.search}%` },
      );
    });
  });
});
