import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * 스타터 users 테이블. 로그인 화면과 연계되는 최소 스키마이며,
 * 실제 요구사항에 맞춰 자유롭게 수정/확장하면 된다.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * 프로젝트 테이블. 한 사용자가 여러 프로젝트를 가질 수 있다(1:N).
 * 사용자가 삭제되면 해당 프로젝트도 함께 삭제된다(cascade).
 */
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // 프로젝트 이름은 전역(모든 사용자 통틀어) 유일하다.
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

/**
 * 문서 테이블. 프로젝트의 각 단계(step)에 속한 마크다운 문서를 보관한다.
 * 프로젝트가 삭제되면 문서도 함께 삭제된다(cascade).
 */
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  // 어떤 단계의 문서인지 (예: "background", "proposal")
  step: varchar("step", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  // 마크다운 본문
  content: text("content").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
