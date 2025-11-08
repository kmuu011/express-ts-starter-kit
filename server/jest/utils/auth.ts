import { expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';

export interface TestCredentials {
  id: string;
  password: string;
  userAgent: string;
}

export async function signupAndLogin({
  id,
  password,
  userAgent,
}: TestCredentials): Promise<string> {
  const signupRes = await request(app)
    .post('/api/member/signup')
    .set('User-Agent', userAgent)
    .send({ id, password });

  expect(signupRes.status).toBe(200);
  expect(signupRes.body.result).toBe(true);

  const loginRes = await request(app)
    .post('/api/member/login')
    .set('User-Agent', userAgent)
    .send({ id, password });

  expect(loginRes.status).toBe(200);
  expect(typeof loginRes.body.sessionKey).toBe('string');

  return loginRes.body.sessionKey;
}


