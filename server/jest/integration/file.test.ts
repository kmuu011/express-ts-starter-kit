import fs from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import app from '../../src/app';
import { config } from '../../src/config';
import { truncateAllTables } from '../utils/dbReset';
import { signupAndLogin } from '../utils/auth';

describe('FileController integration', () => {
  const testCredentials = { id: 'fileUser', password: 'filePass123!' };
  const testUserAgent = 'jest-supertest-file-agent';
  const sampleFilePath = path.join(__dirname, '../files/img.jpg');

  let sessionKey: string;
  let uploadedFileIdx: number;
  let uploadedFileKey: string;

  beforeAll(async () => {
    await truncateAllTables();
    sessionKey = await signupAndLogin({
      ...testCredentials,
      userAgent: testUserAgent,
    });
  });

  afterAll(async () => {
    await truncateAllTables();
  });

  it('파일 업로드, 조회, 다운로드, 삭제 플로우를 수행해야 함', async () => {
    const uploadRes = await request(app)
      .post('/api/file/upload')
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .attach('files', sampleFilePath);

    expect(uploadRes.status).toBe(200);
    expect(uploadRes.body.result).toBe(true);

    const listRes = await request(app)
      .get('/api/file')
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .query({ page: 1, count: 10 });

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.itemList)).toBe(true);
    expect(listRes.body.itemList.length).toBeGreaterThanOrEqual(1);
    expect(typeof listRes.body.totalCount).toBe('number');

    const latestFile = listRes.body.itemList[0];
    uploadedFileIdx = latestFile.idx;
    uploadedFileKey = latestFile.fileKey;

    const storedFilePath = path.join(config.staticPath, uploadedFileKey);
    expect(fs.existsSync(storedFilePath)).toBe(true);

    const detailRes = await request(app)
      .get(`/api/file/${uploadedFileIdx}`)
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent);

    expect(detailRes.status).toBe(200);
    expect(detailRes.body.idx).toBe(uploadedFileIdx);
    expect(detailRes.body.fileKey).toBe(uploadedFileKey);

    const downloadRes = await request(app)
      .post(`/api/file/${uploadedFileIdx}/download`)
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .buffer()
      .parse((res, callback) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(chunks)));
      });

    expect(downloadRes.status).toBe(200);
    expect(downloadRes.headers['content-disposition']).toContain('attachment');
    expect(downloadRes.body.length).toBeGreaterThan(0);

    const deleteRes = await request(app)
      .delete(`/api/file/${uploadedFileIdx}`)
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.result).toBe(true);

    const listAfterDeleteRes = await request(app)
      .get('/api/file')
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .query({ page: 1, count: 10 });

    expect(listAfterDeleteRes.status).toBe(200);
    expect(Array.isArray(listAfterDeleteRes.body.itemList)).toBe(true);
    expect(listAfterDeleteRes.body.itemList.find((file: any) => file.idx === uploadedFileIdx)).toBeUndefined();
    expect(fs.existsSync(storedFilePath)).toBe(false);
  });
});


