import { sql } from "../db/index.js";
import { v4 as uuid } from "uuid";

export const ServantModel = {
  async getRandomByRarity(rarity) {
    const result = await sql.execute(`SELECT * FROM servants WHERE rarity = ?`, [rarity]);
    const pool = result.rows;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  async addToCollection(userId, servantId) {
    await sql.execute(
      `INSERT INTO user_servants (id, user_id, servant_id) VALUES (?, ?, ?)`,
      [uuid(), userId, servantId]
    );
  },

  async getCollection(userId, filters = {}) {
    let query = `SELECT us.id, s.servant_id, s.name, s.class, s.rarity, s.noble_phantasm, us.summoned_at FROM user_servants us INNER JOIN servants s ON us.servant_id = s.servant_id WHERE us.user_id = ?`;
    const params = [userId];

    if (filters.class) {
      query += ` AND s.class = ?`;
      params.push(filters.class);
    }
    if (filters.rarity) {
      query += ` AND s.rarity = ?`;
      params.push(parseInt(filters.rarity));
    }

    const result = await sql.execute(query, params);
    return result.rows;
  },

  async getById(servantId) {
    const result = await sql.execute(`SELECT * FROM servants WHERE servant_id = ?`, [servantId]);
    return result.rows[0] || null;
  },

  async ownsServant(userId, servantId) {
    const result = await sql.execute(
      `SELECT * FROM user_servants WHERE user_id = ? AND servant_id = ?`,
      [userId, servantId]
    );
    return result.rows[0] || null;
  },
};