import Redis from "ioredis";

const url = process.env.REDIS_URL ?? "redis://localhost:6379";

/**
 * 개발 환경 HMR로 모듈이 재평가될 때 커넥션이 중복 생성되는 것을 막기 위해
 * ioredis 클라이언트를 globalThis에 캐싱한다.
 */
const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const redis =
  globalForRedis.redis ??
  new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
