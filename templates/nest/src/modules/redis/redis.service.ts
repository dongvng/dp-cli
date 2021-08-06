import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: any, options?: CachingConfig): Promise<any> {
    return this.cacheManager.set(key, value, options);
  }

  async get(key: string): Promise<unknown> {
    return this.cacheManager.get(key);
  }

  async getObject<T>(key: string): Promise<T> {
    return (this.cacheManager.get(key) as unknown) as T;
  }
}
