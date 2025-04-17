import {Request} from "express";
import {config} from "../../config";
import {Message} from "../../utils/MessageUtility";
import {inject, injectable} from "inversify";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {FileDao} from "./file.dao";
import {keyDescriptionObj} from "../../constants/keyDescriptionObj";
import {existsSync, unlinkSync} from "node:fs";

@injectable()
export class FileService {
  constructor(@inject(DI_TYPES.FileDao) private readonly fileDao: FileDao) {
  }

  async selectOne(
    {
      req
    }: {
      req: Request
    }
  ) {
    const fileIdx = Number(req.params.fileIdx);

    const file = await this.fileDao.selectOne({
      db: req.db!,
      idx: fileIdx
    });

    if (!file) {
      throw Message.NOT_EXIST(keyDescriptionObj.file);
    }

    return file;
  }

  async selectList(
    {
      req
    }: {
      req: Request
    }
  ) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const count = parseInt(req.query.count as string, 10) || 10;

    return await this.fileDao.selectList({
      db: req.db!,
      page,
      count
    });
  }

  async insert(
    {
      req
    }: {
      req: Request
    }
  ) {
    const memberIdx = req.memberInfo!.idx;
    const fileList = req?.files as MulterFile[];

    for (const file of fileList) {
      file.fileKey = `${config.filePath.file}${file.filename}`;

      const {
        fileKey,
        fileName,
        fileType,
        size
      } = file;

      await this.fileDao.insert({
        db: req.db!,
        fileKey,
        fileName: fileName!,
        fileType: fileType!,
        fileSize: size,
        memberIdx,
      });
    }

  }

  async delete(
    {
      req
    }: {
      req: Request
    }
  ) {
    const fileInfo = req.fileInfo;
    const filePath = config.staticPath + fileInfo?.fileKey;

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    await this.fileDao.delete({
      db: req.db!,
      idx: fileInfo?.idx!
    });
  }

}