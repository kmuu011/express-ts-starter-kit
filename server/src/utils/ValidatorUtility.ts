import {keyDescriptionObj} from "../constants/keyDescriptionObj";
import {Message} from "./MessageUtility";
import {ObjectUtility} from "./ObjectUtility";

interface ValidationRule {
  reg: RegExp;
  msg: string;
}

export class ValidatorUtility {
  public static validatorType: { [key: string]: ValidationRule } = {
    img: {
      reg: /^jpg$|^jpeg$|^png$|^gif$/,
      msg: 'jpg, jpeg, png, gif 형식의 파일만 업로드 할 수 있습니다.'
    },
    video: {
      reg: /^mp4$/,
      msg: 'mp4 형식의 파일만 업로드 할 수 있습니다.'
    }
  };

  public static fileValidate(
    {
      fileList,
      maxSize,
      type,
    }: {
      fileList: any[];
      maxSize: number;
      type: ValidationRule;
    }
  ): void {
    if (!fileList) {
      throw Message.NOT_EXIST(keyDescriptionObj.file);
    }

    for (const file of fileList) {
      if (file === undefined) {
        throw Message.INVALID_PARAM('file');
      }

      // 파일 크기 체크 (MB 단위)
      if (file.fileSize / 1024 / 1024 > maxSize) {
        throw Message.TOO_LARGE_SIZE_FILE(maxSize);
      }

      if (type !== undefined) {
        if (!type.reg.test(file.fileType)) {
          throw Message.CUSTOM_ERROR(type.msg);
        }
      }
    }
  }

  public static objectValueValidationCheck(
    object: AnyObject
  ): boolean {
    if (!object) return false;
    object = ObjectUtility.removeNullOrUndefinedOfObject(object);
    return Object.keys(object).length !== 0;
  }

  public static stringValidate(
    keys: string,
    obj: AnyObject,
  ): void {
    const keyList = keys.replace(/\s/g, '').split(',');
    for (const k of keyList) {
      if (obj[k] === undefined || obj[k].toString().replace(/\s/g, '') === '') {
        throw Message.INVALID_PARAM(keyDescriptionObj[k]);
      }
      obj[k] = obj[k].toString();
      if (obj[k].constructor !== String) {
        throw Message.WRONG_PARAM(keyDescriptionObj[k]);
      }
    }
  }

  public static intValidate(
    keys: string,
    obj: AnyObject
  ): void {
    const keyList = keys.replace(/\s/g, '').split(',');

    for (const k of keyList) {
      if (obj[k] === undefined || isNaN(parseInt(obj[k]))) {
        throw Message.INVALID_PARAM(keyDescriptionObj[k]);
      }

      obj[k] = parseInt(obj[k]);

      if (obj[k].constructor !== Number) {
        throw Message.WRONG_PARAM(keyDescriptionObj[k]);
      }
    }
  }

  public static booleanValidate(
    keys: string,
    obj: AnyObject
  ): void {
    const keyList = keys.replace(/\s/g, '').split(',');

    for (const k of keyList) {
      if (obj[k] === undefined) {
        throw Message.INVALID_PARAM(keyDescriptionObj[k]);
      }

      if (obj[k]?.constructor !== Boolean) {
        throw Message.WRONG_PARAM(keyDescriptionObj[k]);
      }
    }
  }

  public static dateValidate(
    keys: string,
    obj: AnyObject
  ): void {
    const keyList = keys.replace(/\s/g, '').split(',');

    for (const k of keyList) {
      if (obj[k] === undefined) {
        throw Message.INVALID_PARAM(keyDescriptionObj[k]);
      }

      const date = new Date(obj[k]);

      if (date.constructor !== Date) {
        throw Message.WRONG_PARAM(keyDescriptionObj[k]);
      }

      obj[k] = date;
    }
  }
}
