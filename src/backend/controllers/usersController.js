import { UserModel } from "../models/users.js";
import { QuestModel } from "../models/quests.js";
import { AppError, ERROR_CODES } from "../utils/errors.js";
import { generateToken } from "../utils/auth.js";

export const UsersController = {
  async create(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || username.trim() === "") {
        throw new AppError("Username is required.", 400, ERROR_CODES.VALIDATION);
      }
      if (!password || password.length < 6) {
        throw new AppError("Password must be at least 6 characters.", 400, ERROR_CODES.VALIDATION);
      }

      const newUser = await UserModel.create(username, password);
      await QuestModel.initializeQuestsForUser(newUser.userId);

      const token = generateToken({ user_id: newUser.userId, username: newUser.username });

      res.status(201).json({ ...newUser, token });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new AppError("Username and password are required.", 400, ERROR_CODES.VALIDATION);
      }

      const user = await UserModel.verifyPassword(username, password);
      if (!user) {
        throw new AppError("Invalid username or password.", 401, ERROR_CODES.UNAUTHORIZED);
      }

      const token = generateToken(user);
      const profile = await UserModel.findById(user.user_id);

      res.json({ ...profile, token });
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

      const today = new Date().toISOString().split("T")[0];
      if (user.last_login && user.last_login.startsWith(today)) {
        throw new AppError("Daily bonus already claimed today! Come back tomorrow.", 400, ERROR_CODES.CONFLICT);
      }

      const bonus = 5;
      const total = await UserModel.addQuartz(user.user_id, bonus);
      await UserModel.updateLastLogin(user.user_id);

      res.json({ message: `Login bonus! Received ${bonus} Saint Quartz.`, totalQuartz: total });
    } catch (err) {
      next(err);
    }
  },
};