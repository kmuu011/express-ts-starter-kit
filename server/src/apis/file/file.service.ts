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
    fileIdx: number,
    memberIdx: number
  ) {
    const file = await this.fileDao.selectOne({
      idx: fileIdx,
      memberIdx
    });

    if (!file) {
      throw Message.NOT_EXIST(keyDescriptionObj.file);
    }

    return file;
  }

  async selectList(
    page: number,
    count: number,
    memberIdx: number
  ) {
    return await this.fileDao.selectList({
      page,
      count,
      memberIdx
    });
  }

  async insert(
    memberIdx: number,
    fileList: MulterFile[]
  ) {
    for (const file of fileList) {
      file.fileKey = `${config.filePath.file}${file.filename}`;

      const {
        fileKey,
        fileName,
        fileType,
        size
      } = file;

      await this.fileDao.insert({
        fileKey,
        fileName: fileName!,
        fileType: fileType!,
        fileSize: size,
        memberIdx,
      });
    }
  }

  async delete(
    fileInfo: any,
    memberIdx: number
  ) {
    const filePath = config.staticPath + fileInfo?.fileKey;

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    await this.fileDao.delete({
      idx: fileInfo?.idx!,
      memberIdx
    });
  }

}