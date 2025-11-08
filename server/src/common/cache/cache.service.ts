import { createClient, RedisClientType } from 'redis';
import { Utility } from "../../utils/Utility";
import { config } from "../../config";
import { injectable } from "inversify";

@injectable()
export class CacheService {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });

    this.redisClient.connect()
      .then(() => { })
      .catch((err: Error) => {
        console.error('Redis connection error:', err);
      });

    this.redisClient.on('error', (error: Error) => {
      console.error('Redis error:', error);
    });
  }

  public async setCache(key: string, value: string, ttl?: number): Promise<string> {
    try {
      return await this.redisClient.setEx(key, ttl || config.redis.defaultTTL, value);
    } catch (e) {
      console.error('setCache error:', e);
      return '';
    }
  }

  public async getCache(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (e) {
      console.error('getCache error:', e);
      return null;
    }
  }

  public async deleteCache(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (e) {
      console.error('deleteCache error:', e);
      return 0;
    }
  }

  public async getCacheTTL(key: string): Promise<number> {
    try {
      return await this.redisClient.ttl(key);
    } catch (e) {
      console.error('getCacheTTL error:', e);
      return -1;
    }
  }

  public async getCacheAllKeyList(): Promise<string[]> {
    try {
      return await this.redisClient.keys('*');
    } catch (e) {
      console.error('getCacheAllKeyList error:', e);
      return [];
    }
  }

  public async getCacheUnqKey(): Promise<string> {
    while (true) {
      const key = Utility.createRandomString();
      const data = await this.redisClient.get(key);
      if (data === null) {
        return key;
      }
    }
  }
}
