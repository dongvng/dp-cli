import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisConfig } from 'src/configs/configs.constants';
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
