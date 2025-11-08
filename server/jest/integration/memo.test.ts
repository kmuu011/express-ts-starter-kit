import request from 'supertest';
import app from '../../src/app';
import { truncateAllTables } from '../utils/dbReset';
import { signupAndLogin } from '../utils/auth';

describe('MemoController integration', () => {
  const testCredentials = { id: 'memoUser', password: 'memoPass123' };
  const testUserAgent = 'jest-supertest-agent';

  let sessionKey: string;
  let memoIdx: number;

  beforeAll(async () => {
    await truncateAllTables();
    sessionKey = await signupAndLogin({
      ...testCredentials,
      userAgent: testUserAgent,
    });
  });

  it('메모 CRUD 플로우를 수행해야 함', async () => {
    const createRes = await request(app)
      .post('/api/memo')
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .send({ content: '첫 번째 메모입니다.' });

    expect(createRes.status).toBe(200);
    expect(typeof createRes.body.idx).toBe('number');

    memoIdx = createRes.body.idx;

    const detailRes = await request(app)
      .get(`/api/memo/${memoIdx}`)
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent);

    expect(detailRes.status).toBe(200);
    expect(detailRes.body.idx).toBe(memoIdx);
    expect(detailRes.body.content).toBe('첫 번째 메모입니다.');

    const listRes = await request(app)
      .get('/api/memo')
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .query({ page: 1, count: 10 });

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.itemList)).toBe(true);
    expect(listRes.body.itemList.length).toBe(2); // 회원가입과 동시에 생성된 메모 1개가 이미 있음
    expect(listRes.body.itemList[0].idx).toBe(memoIdx);
    expect(listRes.body.page).toBe(1);
    expect(listRes.body.count).toBe(10);

    const updateRes = await request(app)
      .put(`/api/memo/${memoIdx}`)
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .send({ content: '수정된 메모입니다.' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.result).toBe(true);

    const updatedDetailRes = await request(app)
      .get(`/api/memo/${memoIdx}`)
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent);

    expect(updatedDetailRes.status).toBe(200);
    expect(updatedDetailRes.body.content).toBe('수정된 메모입니다.');

    const deleteRes = await request(app)
      .delete(`/api/memo/${memoIdx}`)
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.result).toBe(true);

    const listAfterDeleteRes = await request(app)
      .get('/api/memo')
      .set('session-key', sessionKey)
      .set('User-Agent', testUserAgent)
      .query({ page: 1, count: 10 });

    expect(listAfterDeleteRes.status).toBe(200);
    expect(Array.isArray(listAfterDeleteRes.body.itemList)).toBe(true);
    expect(listAfterDeleteRes.body.itemList.length).toBe(1); // 회원가입과 동시에 생성된 메모 1개가 이미 있음음
  });
});


