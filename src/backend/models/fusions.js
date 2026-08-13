import { sql } from "../db/index.js";
import { v4 as uuid } from "uuid";

export const FusionModel = {
  async convertDuplicate(userId, servantId) {
    // Find one duplicate entry
    const result = await sql.execute(
      `SELECT us.id, us.servant_id, s.rarity, s.name
       FROM user_servants us
       INNER JOIN servants s ON us.servant_id = s.servant_id
       WHERE us.user_id = ? AND us.servant_id = ?
       LIMIT 1`,
      [userId, servantId]
    );
    const servant = result.rows[0];
    if (!servant) return null;

    // Check if user has more than 1
    const countResult = await sql.execute(
      `SELECT COUNT(*) as count FROM user_servants WHERE user_id = ? AND servant_id = ?`,
      [userId, servantId]
    );
    if (countResult.rows[0].count < 2) return null;

    // Delete one copy
    await sql.execute(`DELETE FROM user_servants WHERE id = ?`, [servant.id]);

    // Calculate quartz reward
    const quartzReward = servant.rarity === 5 ? 30 : servant.rarity === 4 ? 10 : 3;

    // Add quartz to user
    const userResult = await sql.execute(`SELECT saint_quartz FROM users WHERE user_id = ?`, [userId]);
    await sql.execute(`UPDATE users SET saint_quartz = ? WHERE user_id = ?`, [userResult.rows[0].saint_quartz + quartzReward, userId]);

    // Record fusion
    await sql.execute(
      `INSERT INTO fusions (fusion_id, user_id, servant_id, result, reward) VALUES (?, ?, ?, 'quartz', ?)`,
      [uuid(), userId, servantId, `+${quartzReward} quartz`]
    );

    return { servantName: servant.name, quartzReward };
  },

  async tradeUp(userId, servantId) {
    // Check user has at least 3
    const countResult = await sql.execute(
      `SELECT COUNT(*) as count FROM user_servants WHERE user_id = ? AND servant_id = ?`,
      [userId, servantId]
    );
    if (countResult.rows[0].count < 3) return null;

    // Get servant details
    const servantResult = await sql.execute(
      `SELECT us.servant_id, s.name, s.rarity, s.class
       FROM user_servants us
       INNER JOIN servants s ON us.servant_id = s.servant_id
       WHERE us.user_id = ? AND us.servant_id = ?
       LIMIT 1`,
      [userId, servantId]
    );
    const servant = servantResult.rows[0];

    // Delete 3 copies
    const copies = await sql.execute(
      `SELECT id FROM user_servants WHERE user_id = ? AND servant_id = ? LIMIT 3`,
      [userId, servantId]
    );
    for (const copy of copies.rows) {
      await sql.execute(`DELETE FROM user_servants WHERE id = ?`, [copy.id]);
    }

    // Get random servant of next rarity
    const nextRarity = servant.rarity + 1;
    const pool = await sql.execute(`SELECT * FROM servants WHERE rarity = ?`, [nextRarity]);
    if (pool.rows.length === 0) return { error: "No higher rarity servants available." };

    const newServant = pool.rows[Math.floor(Math.random() * pool.rows.length)];

    // Add new servant
    await sql.execute(
      `INSERT INTO user_servants (id, user_id, servant_id) VALUES (?, ?, ?)`,
      [uuid(), userId, newServant.servant_id]
    );

    // Record fusion
    await sql.execute(
      `INSERT INTO fusions (fusion_id, user_id, servant_id, result, reward) VALUES (?, ?, ?, 'trade-up', ?)`,
      [uuid(), userId, servantId, newServant.servant_id]
    );

    return { tradedServant: servant.name, newServant };
  },

  async getHistory(userId) {
    const result = await sql.execute(
      `SELECT f.*, s.name as servant_name
       FROM fusions f
       INNER JOIN servants s ON f.servant_id = s.servant_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC
       LIMIT 20`,
      [userId]
    );
    return result.rows;
  },
};