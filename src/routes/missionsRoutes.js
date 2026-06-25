import { Router } from "express";
import { MissionsController } from "../controllers/missionsController.js";

const router = Router();

/**
 * @swagger
 * /users/missions:
 *   post:
 *     tags: [Missions]
 *     summary: Send a servant on a mission
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [servantId, missionType]
 *             properties:
 *               servantId:
 *                 type: string
 *               missionType:
 *                 type: string
 *                 enum: [material-gathering, scouting, holy-grail-hunt]
 *     responses:
 *       201:
 *         description: Mission started
 *       400:
 *         description: Validation error
 *       404:
 *         description: Master not found
 *   get:
 *     tags: [Missions]
 *     summary: View all missions
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, claimed]
 *     responses:
 *       200:
 *         description: Missions returned
 */
router.post("/missions", MissionsController.startMission);
router.get("/missions", MissionsController.getMissions);

/**
 * @swagger
 * /users/missions/claim:
 *   post:
 *     tags: [Missions]
 *     summary: Claim completed mission rewards
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [missionId]
 *             properties:
 *               missionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rewards claimed
 *       400:
 *         description: Already claimed or still in progress
 *       404:
 *         description: Mission not found
 */
router.post("/missions/claim", MissionsController.claimMission);

export default router;