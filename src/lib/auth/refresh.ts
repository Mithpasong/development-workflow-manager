import { randomBytes, createHash } from "crypto";
import { redis } from "@/redis";

export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7일

const keyFor = (token: string) =>
  `refresh:${createHash("sha256").update(token).digest("hex")}`;

export type RefreshRecord = { userId: string; sid: string };

/**
 * 새 refresh 토큰을 발급하고, 해시를 Redis에 저장(TTL)한다.
 * 저장 키는 원문이 아니라 sha256 해시이므로 Redis가 유출돼도 토큰 역산이 어렵다.
 * 값에는 사용자 ID와 세션 ID(sid)를 담아 단일 세션 검증에 사용한다.
 */
export async function issueRefreshToken(
  userId: string,
  sid: string,
): Promise<string> {
  const token = randomBytes(48).toString("base64url");
  const record: RefreshRecord = { userId, sid };
  await redis.set(
    keyFor(token),
    JSON.stringify(record),
    "EX",
    REFRESH_TOKEN_TTL_SECONDS,
  );
  return token;
}

/**
 * refresh 토큰을 검증하고 즉시 소비(삭제)한다. (회전/rotation 용도)
 * 유효하면 { userId, sid }, 아니면 null.
 */
export async function consumeRefreshToken(
  token: string,
): Promise<RefreshRecord | null> {
  const key = keyFor(token);
  const raw = await redis.get(key);
  if (!raw) return null;
  await redis.del(key);
  try {
    const record = JSON.parse(raw) as RefreshRecord;
    if (record?.userId && record?.sid) return record;
  } catch {
    // 손상된 값은 무효 처리
  }
  return null;
}

/** refresh 토큰을 무효화한다. (로그아웃) */
export async function revokeRefreshToken(token: string): Promise<void> {
  await redis.del(keyFor(token));
}
