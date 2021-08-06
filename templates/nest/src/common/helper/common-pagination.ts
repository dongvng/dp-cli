import { BadRequestException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { commonRadix } from '../constants/common.constants';
import { CommonPaginationDto } from '../dto/pagination.dto';
import { ResponsePagination } from '../dto/response-pagination.dto';

/**
 * Generate response for paginate get endpoint.
 * @param commonPaginationDto CommonPaginationDto
 * @param query SelectQueryBuilder
 */
export async function commonPagination<T>(
  commonPaginationDto: CommonPaginationDto,
  query: SelectQueryBuilder<T>,
): Promise<ResponsePagination<T>> {
  const page = parseInt(commonPaginationDto.page, commonRadix) - 1;
  const pageSize = parseInt(commonPaginationDto.pageSize, commonRadix);
  if (page < 0 || pageSize < 1) {
    throw new BadRequestException();
  }
  const [result, totalCount] = await query
    .skip(page * pageSize)
    .take(pageSize)
    .getManyAndCount();
  return {
    data: result,
    pagination: {
      currentPage: page + 1,
      pageSize,
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
    },
  };
}
