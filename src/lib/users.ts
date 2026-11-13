import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export type AccountInfo = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

/** id로 계정 정보를 조회한다. */
export async function getAccountById(id: string): Promise<AccountInfo | null> {
  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return row ?? null;
}

/** 비밀번호 검증용 해시를 포함해 조회한다. */
export async function getPasswordHash(id: string): Promise<string | null> {
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return row?.passwordHash ?? null;
}

/** 이름을 수정한다. */
export async function updateUserName(
  id: string,
  name: string,
): Promise<{ id: string; email: string; name: string } | null> {
  const [row] = await db
    .update(users)
    .set({ name, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning({ id: users.id, email: users.email, name: users.name });
  return row ?? null;
}

/** 비밀번호 해시를 교체한다. */
export async function updateUserPasswordHash(
  id: string,
  passwordHash: string,
): Promise<void> {
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, id));
}
