// Redis 연결 점검: PING (읽기 전용). 사용법: npm run redis:check
import Redis from "ioredis";

try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local이 없으면 기본값 사용
}

const url = process.env.REDIS_URL ?? "redis://localhost:6379";
const redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 });

try {
  await redis.connect();
  const pong = await redis.ping();
  const info = await redis.info("server");
  const version = (info.match(/redis_version:(\S+)/) ?? [])[1];
  console.log("✅ Redis 연결 성공:", { ping: pong, version, url });
  process.exitCode = 0;
} catch (err) {
  console.error("❌ Redis 연결 실패:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  redis.disconnect();
}
