import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../redis.service';
import { mockCacheManager } from 'src/common/mock/mock-redis';
import { Cache, CachingConfig } from 'cache-manager';

describe('RedisService', () => {
  let redisService: RedisService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });

  describe('set', () => {
    it('should call cache manager set', async () => {
      jest.spyOn(cacheManager, 'set').mockImplementation(() => true);
      const key = 'keyy';
      const value = 'valuueee';
      const option: CachingConfig = { ttl: 10 };
      expect(cacheManager.set).not.toHaveBeenCalled();
      const result = await redisService.set(key, value, option);
      expect(cacheManager.set).toHaveBeenCalledWith(key, value, option);
      expect(result).toBe(true);
    });
  });

  describe('get', () => {
    it('should call cache manager get', async () => {
      jest.spyOn(cacheManager, 'get').mockImplementation(async () => true);
      const key = 'keyy';
      expect(cacheManager.get).not.toHaveBeenCalled();
      const result = await redisService.get(key);
      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });
  });

  describe('getObject', () => {
    it('should call cache manager get', async () => {
      jest.spyOn(cacheManager, 'get').mockImplementation(async () => 'true');
      const key = 'keyy';
      expect(cacheManager.get).not.toHaveBeenCalled();
      const result = await redisService.getObject<string>(key);
      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toBe('true');
    });
  });
});
