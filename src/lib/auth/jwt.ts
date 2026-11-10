import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not set. Add it to .env.local (see .env.example).");
}
const encodedSecret = new TextEncoder().encode(secret);

export const ACCESS_TOKEN_TTL = "15m";
export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // seconds

export type AccessTokenPayload = {
  sub: string; // user id
  email: string;
  name: string;
  sid: string; // 활성 세션 ID (단일 세션 강제용)
};

export async function signAccessToken(
  payload: AccessTokenPayload,
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    sid: payload.sid,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(encodedSecret);
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ["HS256"],
    });
    const p = payload as JWTPayload & {
      email?: string;
      name?: string;
      sid?: string;
    };
    if (!p.sub || !p.email || !p.name || !p.sid) return null;
    return { sub: p.sub, email: p.email, name: p.name, sid: p.sid };
  } catch {
    return null;
  }
}
