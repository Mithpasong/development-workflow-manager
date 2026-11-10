import { randomBytes, createHash } from "crypto";
import { redis } from "@/redis";

export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7일

const keyFor = (token: string) =>
  `refresh:${createHash("sha256").update(token).digest("hex")}`;

/**
 * 새 refresh 토큰을 발급하고, 해시를 Redis에 저장(TTL)한다.
 * 저장되는 값은 원문이 아니라 sha256 해시 키이므로 Redis가 유출돼도 토큰 역산이 어렵다.
 */
export async function issueRefreshToken(userId: string): Promise<string> {
  const token = randomBytes(48).toString("base64url");
  await redis.set(keyFor(token), userId, "EX", REFRESH_TOKEN_TTL_SECONDS);
  return token;
}

/**
 * refresh 토큰을 검증하고 즉시 소비(삭제)한다. (회전/rotation 용도)
 * 유효하면 userId, 아니면 null.
 */
export async function consumeRefreshToken(
  token: string,
): Promise<string | null> {
  const key = keyFor(token);
  const userId = await redis.get(key);
  if (!userId) return null;
  await redis.del(key);
  return userId;
}

/** refresh 토큰을 무효화한다. (로그아웃) */
export async function revokeRefreshToken(token: string): Promise<void> {
  await redis.del(keyFor(token));
}
