import { UserModel } from "../models/users.js";
import { AppError, ERROR_CODES } from "../utils/errors.js";

export const UsersController = {
  async create(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || username.trim() === "") {
        throw new AppError("Username is required.", 400, ERROR_CODES.VALIDATION);
      }
      const user = await UserModel.create(username, password);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  async getByUsername(req, res, next) {
    try {
      const { username } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const count = await UserModel.getServantCount(user.user_id);
      res.json({ ...user, totalServants: count });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const count = await UserModel.getServantCount(req.params.id);
      res.json({ ...user, totalServants: count });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { username } = req.body;
      if (!username || username.trim() === "") {
        throw new AppError("Username is required.", 400, ERROR_CODES.VALIDATION);
      }

      const existing = await UserModel.findById(req.params.id);
      if (!existing) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const updated = await UserModel.updateUsername(req.params.id, username);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const existing = await UserModel.findById(req.params.id);
      if (!existing) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      await UserModel.delete(req.params.id);
      res.json({ message: "Master deleted successfully." });
    } catch (err) {
      next(err);
    }
  },

  async loginBonus(req, res, next) {
    try {
      const { username } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const bonus = 5;
      const total = await UserModel.addQuartz(user.user_id, bonus);
      res.json({ message: `Login bonus! Received ${bonus} Saint Quartz.`, totalQuartz: total });
    } catch (err) {
      next(err);
    }
  },
};