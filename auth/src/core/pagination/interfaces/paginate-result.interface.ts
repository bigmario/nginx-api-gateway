export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    limit: number;
    page: number;
    previousPageUrl: string;
    nextPageUrl: string;
    lastPageUrl: string;
    firstPageUrl: string;
  };
}
