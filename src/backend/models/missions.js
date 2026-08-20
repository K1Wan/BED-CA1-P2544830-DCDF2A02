import { sql } from "../db/index.js";
import { v4 as uuid } from "uuid";

export const MISSION_TYPES = {
  "material-gathering": {
    name: "Material Gathering",
    duration: 30000,
    minQuartz: 3,
    maxQuartz: 5,
    servantChance: 0,
    servantRarity: null,
  },
  "scouting": {
    name: "Scouting",
    duration: 60000,
    minQuartz: 1,
    maxQuartz: 3,
    servantChance: 0.10,
    servantRarity: 3,
  },
  "holy-grail-hunt": {
    name: "Holy Grail Hunt",
    duration: 120000,
    minQuartz: 5,
    maxQuartz: 10,
    servantChance: 0.05,
    servantRarity: 4,
  },
};

const ALL_CLASSES = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin", "Berserker"];

function getRandomClassBonus(missionType) {
  const randomClass = ALL_CLASSES[Math.floor(Math.random() * ALL_CLASSES.length)];

  const bonuses = {
    "material-gathering": { quartzBonus: 2, chanceBonus: 0 },
    "scouting": { quartzBonus: 3, chanceBonus: 0.05 },
    "holy-grail-hunt": { quartzBonus: 5, chanceBonus: 0 },
  };

  return {
    class: randomClass,
    quartzBonus: bonuses[missionType].quartzBonus,
    chanceBonus: bonuses[missionType].chanceBonus,
  };
}

const SERVANT_BONUSES = {
  "saber-artoria": { quartzBonus: 5 },
  "archer-gilgamesh": { quartzBonus: 3 },
  "lancer-cu": { quartzBonus: 1, chanceBonus: 0.05 },
  "rider-iskandar": { quartzBonus: 2 },
  "caster-tamamo": { quartzBonus: 2, chanceBonus: 0.03 },
};

export const MissionModel = {
  async create(userId, userServantId, servantId, missionType, rewardQuartz, rewardServant) {
    const mission = MISSION_TYPES[missionType];
    const missionId = uuid();
    const completedAt = new Date(Date.now() + mission.duration).toISOString();

    await sql.execute(
      `INSERT INTO missions (mission_id, user_id, user_servant_id, servant_id, mission_type, status, reward_quartz, reward_servant, completed_at) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
      [missionId, userId, userServantId, servantId, missionType, rewardQuartz, rewardServant ? rewardServant.servant_id : null, completedAt]
    );

    return { missionId, completedAt, duration: mission.duration };
  },

  async getActiveForServant(userServantId) {
    const result = await sql.execute(
      `SELECT * FROM missions WHERE user_servant_id = ? AND status = 'active'`,
      [userServantId]
    );
    return result.rows[0] || null;
  },

  async getAllForUser(userId, status = null) {
    let query = `SELECT m.*, s.name as servant_name, s.class, s.rarity FROM missions m INNER JOIN servants s ON m.servant_id = s.servant_id WHERE m.user_id = ?`;
    const params = [userId];

    if (status) {
      query += ` AND m.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY m.started_at DESC`;
    const result = await sql.execute(query, params);

    const now = new Date().toISOString();
    return result.rows.map((m) => ({
      ...m,
      readyToClaim: m.status !== "claimed" && m.completed_at <= now,
    }));
  },

  async findById(missionId, userId) {
    const result = await sql.execute(
      `SELECT * FROM missions WHERE mission_id = ? AND user_id = ?`,
      [missionId, userId]
    );
    return result.rows[0] || null;
  },

  async claim(missionId) {
    await sql.execute(`UPDATE missions SET status = 'claimed' WHERE mission_id = ?`, [missionId]);
  },

  calculateBonuses(servantId, servantClass, missionType) {
    let quartzBonus = 0;
    let chanceBonus = 0;
    const bonuses = [];

    const classBonus = getRandomClassBonus(missionType);
    if (classBonus.class === servantClass) {
      quartzBonus += classBonus.quartzBonus || 0;
      chanceBonus += classBonus.chanceBonus || 0;
      bonuses.push(`${classBonus.class} bonus: +${classBonus.quartzBonus || 0}💎`);
    } else {
      bonuses.push(`Bonus class: ${classBonus.class} (no match)`);
    }

    const servantBonus = SERVANT_BONUSES[servantId];
    if (servantBonus) {
      quartzBonus += servantBonus.quartzBonus || 0;
      chanceBonus += servantBonus.chanceBonus || 0;
      bonuses.push(`Servant bonus: +${servantBonus.quartzBonus || 0}💎`);
    }

    return { quartzBonus, chanceBonus, bonuses };
  },
};

export { SERVANT_BONUSES };