import {Request} from "express";
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
    req: Request
  ): Promise<MemoModel> {
    const memoIdx = Number(req.params.memoIdx);

    const memoInfo = await this.memoDao.selectOne({
      db: req.db!,
      idx: memoIdx
    });

    if (!memoInfo) {
      throw Message.NOT_EXIST(keyDescriptionObj.memo);
    }

    return memoInfo;
  }

  async selectList(
    req: Request
  ): Promise<PaginatedServiceData<MemoModel>> {
    const page = parseInt(req.query.page as string, 10) || 1;
    const count = parseInt(req.query.count as string, 10) || 10;
    const memberIdx = req.memberInfo!.idx;

    const {
      itemList,
      totalCount
    } = await this.memoDao.selectList({
      db: req.db!,
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
    req: Request
  ): Promise<{ idx: number }> {
    const {
      content
    } = req.body;
    const memberIdx = req.memberInfo!.idx;

    const insertResult = await this.memoDao.insert({
      db: req.db!,
      memberIdx,
      content
    });

    return {idx: insertResult.insertId};
  }

  async update(
    req: Request
  ): Promise<void> {
    const idx = req.memoInfo?.idx!;

    const {content} = req.body;

    await this.memoDao.update({
      db: req.db!,
      idx,
      content
    });
  }

  async delete(
    req: Request
  ): Promise<void> {
    const idx = req.memoInfo?.idx!;

    await this.memoDao.delete({
      db: req.db!,
      idx
    });
  }
}