import { type RedisOptions } from 'ioredis';
import type { EnvServer } from '@servexa-warranty-ai/env/server';

import { redisRetryStrategy } from './strategies/ioredis-strategy';

export const redisOptionsLocal = ({
    host,
    port,
    node_env,
  }: Pick<
    RedisOptions,
    | 'host'
    | 'port'
    | 'showFriendlyErrorStack'
    | 'lazyConnect'
    | 'commandTimeout'
    | 'retryStrategy'
  > & {
    node_env: EnvServer['NODE_ENV'];
  }): RedisOptions => {
    let totalRetryDuration = 0;
  
    const options: RedisOptions = {
      host,
      port,
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