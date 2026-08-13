import { UserModel } from "../models/users.js";
import { FusionModel } from "../models/fusions.js";
import { QuestModel } from "../models/quests.js";
import { AppError, ERROR_CODES } from "../utils/errors.js";

export const FusionsController = {
  async convertDuplicate(req, res, next) {
    try {
      const { username } = req.query;
      const { servantId } = req.body;

      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);
      if (!servantId) throw new AppError("Servant ID is required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const result = await FusionModel.convertDuplicate(user.user_id, servantId);
      if (!result) throw new AppError("Not enough duplicates to convert. You need at least 2 copies.", 400, ERROR_CODES.CONFLICT);

      await QuestModel.updateProgress(user.user_id, "fusions_done", 1);

      res.json({
        message: `Converted ${result.servantName} duplicate!`,
        quartzEarned: result.quartzReward,
      });
    } catch (err) {
      next(err);
    }
  },

  async tradeUp(req, res, next) {
    try {
      const { username } = req.query;
      const { servantId } = req.body;

      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);
      if (!servantId) throw new AppError("Servant ID is required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const result = await FusionModel.tradeUp(user.user_id, servantId);
      if (!result) throw new AppError("Need at least 3 duplicates to trade up.", 400, ERROR_CODES.CONFLICT);
      if (result.error) throw new AppError(result.error, 400, ERROR_CODES.CONFLICT);

      await QuestModel.updateProgress(user.user_id, "trade_up", 1);

      res.status(201).json({
        message: `Traded 3x ${result.tradedServant} for ${result.newServant.name}!`,
        newServant: result.newServant,
      });
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req, res, next) {
    try {
      const { username } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const history = await FusionModel.getHistory(user.user_id);
      res.json({ fusions: history, total: history.length });
    } catch (err) {
      next(err);
    }
  },
};