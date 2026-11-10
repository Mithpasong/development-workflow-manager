import { defineConfig } from "drizzle-kit";

// Next.js가 아닌 drizzle-kit CLI 실행 시 .env.local을 직접 로드한다.
// (파일이 없으면 무시하고 실제 환경변수로 폴백)
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local이 없으면 기존 process.env 사용
}

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL is not set. Run drizzle-kit with: node --env-file=.env.local, or set it in your environment.",
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
