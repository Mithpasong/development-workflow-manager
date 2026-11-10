import { redis } from "@/redis";
import { REFRESH_TOKEN_TTL_SECONDS } from "./refresh";

/**
 * 단일 세션 강제: 사용자당 "현재 활성 세션 ID(sid)"를 Redis에 하나만 유지한다.
 * 새 로그인이 이 값을 덮어쓰면 이전 기기의 sid는 더 이상 현재 값이 아니게 되어 무효화된다.
 */
const key = (userId: string) => `session:${userId}`;

export async function setActiveSession(
  userId: string,
  sid: string,
): Promise<void> {
  await redis.set(key(userId), sid, "EX", REFRESH_TOKEN_TTL_SECONDS);
}

export async function getActiveSession(
  userId: string,
): Promise<string | null> {
  return redis.get(key(userId));
}

export async function isActiveSession(
  userId: string,
  sid: string,
): Promise<boolean> {
  const current = await getActiveSession(userId);
  return current !== null && current === sid;
}

export async function clearActiveSession(userId: string): Promise<void> {
  await redis.del(key(userId));
}
