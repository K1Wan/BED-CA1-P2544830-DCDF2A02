import { UserModel } from "../models/users.js";
import { QuestModel } from "../models/quests.js";
import { AppError, ERROR_CODES } from "../utils/errors.js";

export const QuestsController = {
  async getQuests(req, res, next) {
    try {
      const { username } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const quests = await QuestModel.getAllForUser(user.user_id);
      res.json({ quests, total: quests.length });
    } catch (err) {
      next(err);
    }
  },

  async claimQuest(req, res, next) {
    try {
      const { username } = req.query;
      const { questId } = req.body;

      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);
      if (!questId) throw new AppError("Quest ID is required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const quest = await QuestModel.claimQuest(user.user_id, questId);
      if (!quest) throw new AppError("Quest not ready or already claimed.", 400, ERROR_CODES.CONFLICT);

      const total = await UserModel.addQuartz(user.user_id, quest.reward_quartz);

      res.json({
        message: `Quest "${quest.name}" claimed!`,
        quartzEarned: quest.reward_quartz,
        totalQuartz: total,
      });
    } catch (err) {
      next(err);
    }
  },
};