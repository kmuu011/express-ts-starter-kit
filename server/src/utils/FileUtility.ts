import {Request} from "express";

export class FileUtility {
  public static organizeFiles(req: Request): void {
    if (!req.files) return;

    const fileObject: { [key: string]: OrganizedFile[] } = {};

    for (const file of req.files as MulterFile[]) {
      const fileType = file.originalname.substring(file.originalname.lastIndexOf('.') + 1).toLowerCase();
      const fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
      const fileBuffer = file.buffer;
      const fileSize = file.size;
      const fileKey = file.fieldname;
      const mimetype = file.mimetype;

      const fileObj: OrganizedFile = {
        fileType,
        fileName,
        fileBuffer,
        fileSize,
        mimeType: mimetype
      };

      if (fileObject[fileKey]) {
        fileObject[fileKey].push(fileObj);
      } else {
        fileObject[fileKey] = [fileObj];
      }
    }

    req.organizedFileList = fileObject;
  }
}