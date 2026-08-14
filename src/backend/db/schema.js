import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: text("user_id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull().default("password123"),
  saintQuartz: integer("saint_quartz").notNull().default(330),
  lastLogin: text("last_login"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const servants = sqliteTable("servants", {
  servantId: text("servant_id").primaryKey(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  rarity: integer("rarity").notNull(),
  noblePhantasm: text("noble_phantasm").notNull(),
});

export const userServants = sqliteTable("user_servants", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  servantId: text("servant_id")
    .notNull()
    .references(() => servants.servantId),
  summonedAt: text("summoned_at").default(sql`CURRENT_TIMESTAMP`),
});

export const missions = sqliteTable("missions", {
  missionId: text("mission_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  userServantId: text("user_servant_id").notNull(),
  servantId: text("servant_id").notNull(),
  missionType: text("mission_type").notNull(),
  status: text("status").notNull().default("active"),
  rewardQuartz: integer("reward_quartz").notNull().default(0),
  rewardServant: text("reward_servant"),
  startedAt: text("started_at").default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
});

export const quests = sqliteTable("quests", {
  questId: text("quest_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  objectiveType: text("objective_type").notNull(),
  targetValue: integer("target_value").notNull(),
  rewardQuartz: integer("reward_quartz").notNull(),
});

export const userQuests = sqliteTable("user_quests", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  questId: text("quest_id")
    .notNull()
    .references(() => quests.questId),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("active"),
});

export const fusions = sqliteTable("fusions", {
  fusionId: text("fusion_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  servantId: text("servant_id").notNull(),
  result: text("result").notNull(),
  reward: text("reward"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});