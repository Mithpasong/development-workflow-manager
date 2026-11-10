import { cookies } from "next/headers";
import { verifyAccessToken, type AccessTokenPayload } from "./jwt";
import { ACCESS_COOKIE } from "./cookies";
import { isActiveSession } from "./activeSession";

/**
 * 현재 요청의 access_token 쿠키에서 로그인 사용자를 읽는다.
 * 서버 컴포넌트/route handler에서 사용. 토큰이 없거나 만료/위조면 null.
 *
 * 단일 세션 강제: 토큰의 sid가 이 사용자의 현재 활성 세션과 다르면(= 다른 기기에서
 * 새로 로그인해 세션이 교체됨) 로그인하지 않은 것으로 간주한다.
 */
export async function getCurrentUser(): Promise<AccessTokenPayload | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  if (!(await isActiveSession(payload.sub, payload.sid))) return null;

  return payload;
}
