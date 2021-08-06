export class ResponsePagination<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPage: number;
    totalCount: number;
  };
}
