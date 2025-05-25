import Redis from "ioredis";

const redisClientSingleton = () => {
  // try {
  return new Redis(process.env.NEXT_PUBLIC_REDIS_HOST!, {
    maxRetriesPerRequest: 20,
  });
  // } catch (e) {
  //   console.log("Error occured while initializind redis", e);
  // }
};

type RedisClientSingleton = ReturnType<typeof redisClientSingleton>;

// Prevent multiple connections in dev due to hot reloading
const globalForRedis = globalThis as unknown as {
  redis: RedisClientSingleton | undefined;
};

export const redis = globalForRedis.redis ?? redisClientSingleton();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
