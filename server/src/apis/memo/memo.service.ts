import {keyDescriptionObj} from "../../constants/keyDescriptionObj";
import {MemoDao} from "./memo.dao";
import {MemoModel} from "./memo.model";
import {Message} from "../../utils/MessageUtility";
import {BaseService} from "../../common/base/base.service";
import {inject, injectable} from "inversify";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {PaginatedServiceData} from "../../interfaces/common";

@injectable()
export class MemoService extends BaseService {
  constructor(
    @inject(DI_TYPES.MemoDao) private readonly memoDao: MemoDao
  ) {
    super();
  }

  async selectOne(
    db: any,
    memoIdx: number
  ): Promise<MemoModel> {
    const memoInfo = await this.memoDao.selectOne({
      db,
      idx: memoIdx
    });

    if (!memoInfo) {
      throw Message.NOT_EXIST(keyDescriptionObj.memo);
    }

    return memoInfo;
  }

  async selectList(
    db: any,
    page: number,
    count: number,
    memberIdx: number
  ): Promise<PaginatedServiceData<MemoModel>> {
    const {
      itemList,
      totalCount
    } = await this.memoDao.selectList({
      db,
      page,
      count,
      memberIdx
    });

    return this.returnListType<MemoModel>({
      itemList,
      page,
      count,
      totalCount,
    });
  }

  async insert(
    db: any,
    memberIdx: number,
    content: string
  ): Promise<{ idx: number }> {
    const insertResult = await this.memoDao.insert({
      db,
      memberIdx,
      content
    });

    return {idx: insertResult.insertId};
  }

  async update(
    db: any,
    idx: number,
    content: string
  ): Promise<void> {
    await this.memoDao.update({
      db,
      idx,
      content
    });
  }

  async delete(
    db: any,
    idx: number
  ): Promise<void> {
    await this.memoDao.delete({
      db,
      idx
    });
  }
}