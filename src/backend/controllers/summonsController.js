import { UserModel } from "../models/users.js";
import { ServantModel } from "../models/servants.js";
import { QuestModel } from "../models/quests.js";
import { AppError, ERROR_CODES } from "../utils/errors.js";

function rollRarity() {
  const roll = Math.random() * 100;
  if (roll < 5) return 5;
  if (roll < 25) return 4;
  return 3;
}

async function pullServant(userId) {
  const rarity = rollRarity();
  const servant = await ServantModel.getRandomByRarity(rarity);
  await ServantModel.addToCollection(userId, servant.servant_id);
  await QuestModel.updateProgress(userId, "total_summons", 1);
  return servant;
}

export const SummonsController = {
  async singleSummon(req, res, next) {
    try {
      const { username } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);
      if (user.saint_quartz < 3) throw new AppError("Not enough Saint Quartz! Need 3.", 400, ERROR_CODES.INSUFFICIENT_FUNDS);

      const newQuartz = await UserModel.addQuartz(user.user_id, -3);
      const servant = await pullServant(user.user_id);

      // Update unique servants quest
      const collection = await ServantModel.getCollection(user.user_id);
      const uniqueCount = new Set(collection.map(s => s.servant_id)).size;
      await QuestModel.setProgress(user.user_id, "unique_servants", uniqueCount);

      // Check for 5-star
      if (servant.rarity === 5) {
        await QuestModel.setProgress(user.user_id, "five_star", 1);
      }

      res.status(201).json({ message: "Summoning complete!", servant, remainingQuartz: newQuartz });
    } catch (err) {
      next(err);
    }
  },

  async multiSummon(req, res, next) {
    try {
      const { username } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);
      if (user.saint_quartz < 30) throw new AppError("Not enough Saint Quartz! Need 30.", 400, ERROR_CODES.INSUFFICIENT_FUNDS);

      const newQuartz = await UserModel.addQuartz(user.user_id, -30);
      const servants = [];
      let hasFiveStar = false;

      for (let i = 0; i < 11; i++) {
        const servant = await pullServant(user.user_id);
        servants.push(servant);
        if (servant.rarity === 5) hasFiveStar = true;
      }

      // Update unique servants quest
      const collection = await ServantModel.getCollection(user.user_id);
      const uniqueCount = new Set(collection.map(s => s.servant_id)).size;
      await QuestModel.setProgress(user.user_id, "unique_servants", uniqueCount);

      // Check for 5-star
      if (hasFiveStar) {
        await QuestModel.setProgress(user.user_id, "five_star", 1);
      }

      res.status(201).json({ message: "Multi-summon complete! 10+1 servants summoned.", servants, remainingQuartz: newQuartz });
    } catch (err) {
      next(err);
    }
  },

  async getCollection(req, res, next) {
    try {
      const { username, class: servantClass, rarity } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const collection = await ServantModel.getCollection(user.user_id, { class: servantClass, rarity });
      res.json({ user: user.username, collection, total: collection.length });
    } catch (err) {
      next(err);
    }
  },
};