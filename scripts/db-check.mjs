// DB 연결 점검: SELECT 1 (읽기 전용). 사용법: npm run db:check
import postgres from "postgres";

try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local이 없으면 기존 환경변수 사용
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (.env.local).");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });

try {
  const [row] = await sql`select 1 as ok, current_database() as db, version() as version`;
  console.log("✅ DB 연결 성공:", {
    ok: row.ok,
    database: row.db,
    version: String(row.version).split(" ").slice(0, 2).join(" "),
  });
  process.exitCode = 0;
} catch (err) {
  console.error("❌ DB 연결 실패:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
