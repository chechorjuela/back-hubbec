export class PaginatorResponse<T> {
  total: number;
  nextPage: number;
  prevPage: number;
  data: T;
  pages: number;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  limit: number;
  offset: number;
}

