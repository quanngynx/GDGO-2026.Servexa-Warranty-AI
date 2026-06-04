import { type RedisOptions } from 'ioredis';
import type { EnvServer } from '@servexa-warranty-ai/env/server';

import { redisRetryStrategy } from './strategies/ioredis-strategy';

export const redisOptionsLocal = ({
    host,
    port,
    password,
    username,
    node_env,
    tls,
  }: Pick<
    RedisOptions,
    | 'host'
    | 'port'
    | 'password'
    | 'username'
    | 'showFriendlyErrorStack'
    | 'lazyConnect'
    | 'commandTimeout'
    | 'retryStrategy'
    | 'tls'
  > & {
    password?: string;
    username?: string;
    tls?: boolean;
    node_env: EnvServer['NODE_ENV'];
  }): RedisOptions => {
    let totalRetryDuration = 0;
  
    const options: RedisOptions = {
      host,
      port,
      tls,
      password,
      username,
      showFriendlyErrorStack: node_env === 'production' ? false : true,
      lazyConnect: true,
      commandTimeout: 1000,
      retryStrategy: (times) => {
        const { delay, retryDuration } = redisRetryStrategy(
          times,
          totalRetryDuration,
        );
        totalRetryDuration = retryDuration;
        return delay;
      },
    };
  
    return options;
  };