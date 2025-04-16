interface MulterFile {
  filename?: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  path?: string;
  fileName?: string;
  fileType?: string;
  fileKey?: string;
}

interface OrganizedFile {
  fileName: string;
  fileType: string;
  fileBuffer: Buffer;
  fileSize: number;
  mimeType: string;
  fileKey?: string;
}