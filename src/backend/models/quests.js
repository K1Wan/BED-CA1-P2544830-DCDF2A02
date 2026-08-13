import { sql } from "../db/index.js";
import { v4 as uuid } from "uuid";

export const QuestModel = {
  async getAllForUser(userId) {
    const result = await sql.execute(
      `SELECT q.quest_id, q.name, q.description, q.objective_type, q.target_value, q.reward_quartz,
              uq.progress, uq.status
       FROM quests q
       LEFT JOIN user_quests uq ON q.quest_id = uq.quest_id AND uq.user_id = ?
       ORDER BY q.quest_id`,
      [userId]
    );
    return result.rows;
  },

  async initializeQuestsForUser(userId) {
    const allQuests = await sql.execute(`SELECT quest_id FROM quests`);
    for (const q of allQuests.rows) {
      await sql.execute(
        `INSERT OR IGNORE INTO user_quests (id, user_id, quest_id, progress, status) VALUES (?, ?, ?, 0, 'active')`,
        [uuid(), userId, q.quest_id]
      );
    }
  },

  async updateProgress(userId, objectiveType, increment = 1) {
    const result = await sql.execute(
      `SELECT uq.*, q.target_value, q.objective_type
       FROM user_quests uq
       INNER JOIN quests q ON uq.quest_id = q.quest_id
       WHERE uq.user_id = ? AND q.objective_type = ? AND uq.status = 'active'`,
      [userId, objectiveType]
    );

    for (const quest of result.rows) {
      const newProgress = Math.min(quest.progress + increment, quest.target_value);
      const newStatus = newProgress >= quest.target_value ? 'ready' : 'active';
      await sql.execute(
        `UPDATE user_quests SET progress = ?, status = ? WHERE id = ?`,
        [newProgress, newStatus, quest.id]
      );
    }
  },

  async setProgress(userId, objectiveType, value) {
    const result = await sql.execute(
      `SELECT uq.*, q.target_value
       FROM user_quests uq
       INNER JOIN quests q ON uq.quest_id = q.quest_id
       WHERE uq.user_id = ? AND q.objective_type = ? AND uq.status = 'active'`,
      [userId, objectiveType]
    );

    for (const quest of result.rows) {
      const newProgress = Math.min(value, quest.target_value);
      const newStatus = newProgress >= quest.target_value ? 'ready' : 'active';
      await sql.execute(
        `UPDATE user_quests SET progress = ?, status = ? WHERE id = ?`,
        [newProgress, newStatus, quest.id]
      );
    }
  },

  async claimQuest(userId, questId) {
    const result = await sql.execute(
      `SELECT uq.*, q.reward_quartz, q.name
       FROM user_quests uq
       INNER JOIN quests q ON uq.quest_id = q.quest_id
       WHERE uq.user_id = ? AND uq.quest_id = ?`,
      [userId, questId]
    );
    const quest = result.rows[0];

    if (!quest) return null;
    if (quest.status !== 'ready') return null;

    await sql.execute(
      `UPDATE user_quests SET status = 'claimed' WHERE id = ?`,
      [quest.id]
    );

    return quest;
  },
};