import { UserEntity } from 'src/modules/users/user.entity';
import { SelectQueryBuilder } from 'typeorm';

export const mockUsersService = {
  getUsers: jest.fn(),
  getById: jest.fn(),
  getByEmail: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  deleteUserById: jest.fn(),
};

export const mockUsersRepository = {
  findOneById: jest.fn(),
  getUsers: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

export const mockQuery = ({
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
} as unknown) as SelectQueryBuilder<UserEntity>;
