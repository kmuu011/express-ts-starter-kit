export interface PaginatedDaoData<T> {
  itemList: T[];
  totalCount: number;
}

export interface PaginatedServiceData<T> {
  itemList: T[];
  page: number;
  count: number;
  totalCount: number;
  last: number,
}