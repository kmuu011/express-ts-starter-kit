import { keyDescriptionObj } from "../../constants/keyDescriptionObj";
import { MemoDao } from "./memo.dao";
import { Message } from "../../utils/MessageUtility";
import { BaseService } from "../../common/base/base.service";
import { inject, injectable } from "inversify";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { PaginatedServiceData } from "../../interfaces/common";
import { MemoModelType } from "./memo.types";

@injectable()
export class MemoService extends BaseService {
  constructor(
    @inject(DI_TYPES.MemoDao) private readonly memoDao: MemoDao
  ) {
    super();
  }

  async selectOne(
    memoIdx: number
  ): Promise<MemoModelType> {
    const memoInfo = await this.memoDao.selectOne({
      idx: memoIdx
    });

    if (!memoInfo) {
      throw Message.NOT_EXIST(keyDescriptionObj.memo);
    }

    return memoInfo;
  }

  async selectList(
    page: number,
    count: number,
    memberIdx: number
  ): Promise<PaginatedServiceData<MemoModelType>> {
    const {
      itemList,
      totalCount
    } = await this.memoDao.selectList({
      page,
      count,
      memberIdx
    });

    return this.returnListType<MemoModelType>({
      itemList,
      page,
      count,
      totalCount,
    });
  }

  async insert(
    memberIdx: number,
    content: string
  ): Promise<{ idx: number }> {
    const insertResult = await this.memoDao.insert({
      memberIdx,
      content
    });

    return { idx: insertResult.insertId };
  }

  async update(
    idx: number,
    content: string
  ): Promise<void> {
    await this.memoDao.update({
      idx,
      content
    });
  }

  async delete(
    idx: number
  ): Promise<void> {
    await this.memoDao.delete({
      idx
    });
  }
}