import { UserModel } from "../models/users.js";
import { ServantModel } from "../models/servants.js";
import { MissionModel, MISSION_TYPES } from "../models/missions.js";
import { AppError, ERROR_CODES } from "../utils/errors.js";

export const MissionsController = {
  async startMission(req, res, next) {
    try {
      const { username } = req.query;
      const { servantId, missionType } = req.body;

      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);
      if (!servantId) throw new AppError("Servant ID is required.", 400, ERROR_CODES.VALIDATION);
      if (!missionType || !MISSION_TYPES[missionType]) {
        throw new AppError("Invalid mission type. Choose: material-gathering, scouting, holy-grail-hunt", 400, ERROR_CODES.VALIDATION);
      }

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const owned = await ServantModel.ownsServant(user.user_id, servantId);
      if (!owned) throw new AppError("You don't own this servant.", 400, ERROR_CODES.VALIDATION);

      const active = await MissionModel.getActiveForServant(owned.id);
      if (active) throw new AppError("This servant is already on a mission.", 400, ERROR_CODES.CONFLICT);

      const servant = await ServantModel.getById(servantId);
      const mission = MISSION_TYPES[missionType];
      const rewardQuartz = Math.floor(Math.random() * (mission.maxQuartz - mission.minQuartz + 1)) + mission.minQuartz;

      let rewardServant = null;
      if (Math.random() < mission.servantChance) {
        rewardServant = await ServantModel.getRandomByRarity(mission.servantRarity);
      }

      const result = await MissionModel.create(user.user_id, owned.id, servantId, missionType, rewardQuartz, rewardServant);

      res.status(201).json({
        message: `${servant.name} sent on ${mission.name}!`,
        missionId: result.missionId,
        missionType: mission.name,
        servant,
        completesIn: `${result.duration / 1000} seconds`,
        completedAt: result.completedAt,
        rewards: { quartz: rewardQuartz, servant: rewardServant ? rewardServant.name : null },
      });
    } catch (err) {
      next(err);
    }
  },

  async getMissions(req, res, next) {
    try {
      const { username, status } = req.query;
      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const missions = await MissionModel.getAllForUser(user.user_id, status);
      res.json({ missions, total: missions.length });
    } catch (err) {
      next(err);
    }
  },

  async claimMission(req, res, next) {
    try {
      const { username } = req.query;
      const { missionId } = req.body;

      if (!username) throw new AppError("Username query parameter required.", 400, ERROR_CODES.VALIDATION);
      if (!missionId) throw new AppError("Mission ID is required.", 400, ERROR_CODES.VALIDATION);

      const user = await UserModel.findByUsername(username);
      if (!user) throw new AppError("Master not found.", 404, ERROR_CODES.NOT_FOUND);

      const mission = await MissionModel.findById(missionId, user.user_id);
      if (!mission) throw new AppError("Mission not found.", 404, ERROR_CODES.NOT_FOUND);
      if (mission.status === "claimed") throw new AppError("Rewards already claimed.", 400, ERROR_CODES.CONFLICT);

      const now = new Date().toISOString();
      if (mission.completed_at > now) {
        const remaining = Math.ceil((new Date(mission.completed_at) - new Date(now)) / 1000);
        throw new AppError(`Mission still in progress. ${remaining} seconds remaining.`, 400, ERROR_CODES.VALIDATION);
      }

      await MissionModel.claim(missionId);
      const total = await UserModel.addQuartz(user.user_id, mission.reward_quartz);

      let bonusServant = null;
      if (mission.reward_servant) {
        await ServantModel.addToCollection(user.user_id, mission.reward_servant);
        bonusServant = await ServantModel.getById(mission.reward_servant);
      }

      res.json({
        message: "Rewards claimed!",
        quartzEarned: mission.reward_quartz,
        totalQuartz: total,
        bonusServant: bonusServant ? bonusServant.name : null,
      });
    } catch (err) {
      next(err);
    }
  },
};