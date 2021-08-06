import { BadRequestException } from '@nestjs/common';
import { CommonPaginationDto } from 'src/common/dto/pagination.dto';
import { ResponsePagination } from 'src/common/dto/response-pagination.dto';
import { SelectQueryBuilder } from 'typeorm';
import { commonPagination } from '../common-pagination';

const mockSelectQueryBuilder = new SelectQueryBuilder<string>(null);

describe('CommonPagination', () => {
  it('should be defined', () => {
    expect(commonPagination).toBeDefined();
  });

  it('should throw exception for invalid params', async () => {
    const paginationDto: CommonPaginationDto = {
      page: '-1',
      pageSize: '10',
      search: null,
    };
    await expect(
      commonPagination(paginationDto, mockSelectQueryBuilder),
    ).rejects.toThrow(new BadRequestException());
  });

  it('should handle the valid params', async () => {
    const paginationDto: CommonPaginationDto = {
      page: '1',
      pageSize: '10',
      search: null,
    };
    const responsePagination: ResponsePagination<string> = {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 2,
        totalPage: 1,
      },
      data: ['abc', 'aaa'],
    };
    const spyTake = jest.spyOn(mockSelectQueryBuilder, 'take');
    const spySkip = jest.spyOn(mockSelectQueryBuilder, 'skip');
    jest
      .spyOn(mockSelectQueryBuilder, 'getManyAndCount')
      .mockImplementation(async () => [['abc', 'aaa'], 2]);
    const result = await commonPagination(
      paginationDto,
      mockSelectQueryBuilder,
    );
    expect(spyTake).toHaveBeenCalledWith(10);
    expect(spySkip).toHaveBeenCalledWith(0);
    expect(result).toEqual(responsePagination);
  });
});
