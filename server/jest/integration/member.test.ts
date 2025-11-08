import request from 'supertest';
import app from '../../src/app';
import { truncateAllTables } from '../utils/dbReset';

describe('MemberController duplicateCheck', () => {
  let sessionKey: string;

  beforeAll(async () => {
    await truncateAllTables();
  });

  it('회원가입 돼야함', async () => {
    const res = await request(app)
      .post('/api/member/signup')
      .send({ id: 'qa1', password: 'qa1' });

    expect(res.body.result).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it('로그인 돼야함', async () => {
    const res = await request(app)
      .post('/api/member/login')
      .send({ id: 'qa1', password: 'qa1' });

    sessionKey = res.body.sessionKey;

    expect(typeof res.body.sessionKey).toBe('string');
    expect(res.status).toBe(200);
  });

  it('중복 여부를 반환해야 함', async () => {
    const res = await request(app)
      .get('/api/member/duplicateCheck')
      .query({ value: 'tester', type: 1 });

    expect(res.body.isDuplicated).toBeFalsy();
    expect(res.status).toBe(200);

    const res2 = await request(app)
      .get('/api/member/duplicateCheck')
      .query({ value: 'qa1', type: 1 });

    expect(res2.body.isDuplicated).toBeTruthy();
    expect(res2.status).toBe(200);
  });

  it('로그아웃 돼야함', async () => {
    const res = await request(app)
      .post('/api/member/logout')
      .set('session-key', sessionKey);

    expect(res.body.result).toBeTruthy();
    expect(res.status).toBe(200);
  });

});
