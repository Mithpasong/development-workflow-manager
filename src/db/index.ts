import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local (see .env.example).",
  );
}

/**
 * 개발 환경에서 HMR로 모듈이 재평가될 때 커넥션이 중복 생성되는 것을 막기 위해
 * postgres.js 클라이언트를 globalThis에 캐싱한다.
 */
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

const client = globalForDb.client ?? postgres(connectionString, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });

export { schema };
