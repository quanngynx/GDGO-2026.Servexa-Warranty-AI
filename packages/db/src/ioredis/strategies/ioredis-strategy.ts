import { REDIS_MAX_RETRY_DURATION } from '../ioredis-constants';

type RedisRetryStrategyType = {
  delay: number | null;
  retryDuration: number;
};

export const redisRetryStrategy = (
  times: number,
  totalRetryDuration: number,
): RedisRetryStrategyType => {
  // Exponential backoff, cap at 30 seconds
  const delay = Math.min(1000 * 2 ** times, 30000);
  const currentRetryDuration = totalRetryDuration + delay;

  if (currentRetryDuration >= REDIS_MAX_RETRY_DURATION) {
    console.error(
      'REDIS: Stopping reconnection attempts. Max retry duration reached.',
    );
    return {
      delay: null,
      retryDuration: currentRetryDuration,
    };
  }

  console.log(
    `REDIS: connection retry, attempt ${times}, waiting for ${delay}ms`,
  );
  return {
    delay,
    retryDuration: currentRetryDuration,
  };
};
