import { NotFoundException } from '@nestjs/common';
import { CommonError } from 'src/common/constants/common.constants';
import { ResponsePagination } from 'src/common/dto/response-pagination.dto';
import { commonPagination } from 'src/common/helper/common-pagination';
import { EntityRepository, Repository } from 'typeorm';
import { GetUsersDto } from './dto/get-users.dto';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(CommonError.NOT_FOUND_USER);
    }
    return user;
  }

  async getUsers(
    getUsersDto: GetUsersDto,
  ): Promise<ResponsePagination<UserEntity>> {
    const { search, role } = getUsersDto;
    const query = this.createQueryBuilder('user');
    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    if (search) {
      query.andWhere('user.name ILIKE :search', { search: `%${search}%` });
    }

    query.addOrderBy('user.createdAt', 'DESC');
    return commonPagination(getUsersDto, query);
  }
}
