import { sql } from "../db/index.js";
import { v4 as uuid } from "uuid";

export const UserModel = {
  async create(username, password = "password123") {
    const userId = uuid();
    await sql.execute(
      `INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)`,
      [userId, username.trim(), password]
    );
    return { userId, username: username.trim(), saintQuartz: 330 };
  },

  async findByUsername(username) {
    const result = await sql.execute(
      `SELECT user_id, username, saint_quartz, created_at FROM users WHERE username = ?`,
      [username]
    );
    return result.rows[0] || null;
  },

  async findById(userId) {
    const result = await sql.execute(
      `SELECT user_id, username, saint_quartz, created_at FROM users WHERE user_id = ?`,
      [userId]
    );
    return result.rows[0] || null;
  },

  async updateUsername(userId, username) {
    await sql.execute(`UPDATE users SET username = ? WHERE user_id = ?`, [username.trim(), userId]);
    return this.findById(userId);
  },

  async delete(userId) {
    await sql.execute(`DELETE FROM users WHERE user_id = ?`, [userId]);
  },

  async addQuartz(userId, amount) {
    const user = await this.findById(userId);
    const newTotal = user.saint_quartz + amount;
    await sql.execute(`UPDATE users SET saint_quartz = ? WHERE user_id = ?`, [newTotal, userId]);
    return newTotal;
  },

  async getServantCount(userId) {
    const result = await sql.execute(`SELECT COUNT(*) as count FROM user_servants WHERE user_id = ?`, [userId]);
    return result.rows[0].count;
  },
};