import {PaginatedServiceData} from "../../interfaces/common";

export abstract class BaseService {
  protected returnListType<T>(
    {
      itemList,
      page,
      count,
      totalCount,
    }: {
      itemList: T[];
      page: number;
      count: number;
      totalCount: number;
    }
  ): PaginatedServiceData<T> {

    return {
      itemList,
      page,
      count,
      totalCount,
      last: Math.ceil(totalCount / count)
    };
  }
}
