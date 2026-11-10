import { cookies } from "next/headers";
import { verifyAccessToken, type AccessTokenPayload } from "./jwt";
import { ACCESS_COOKIE } from "./cookies";

/**
 * 현재 요청의 access_token 쿠키에서 로그인 사용자를 읽는다.
 * 서버 컴포넌트/route handler에서 사용. 토큰이 없거나 만료/위조면 null.
 */
export async function getCurrentUser(): Promise<AccessTokenPayload | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}
