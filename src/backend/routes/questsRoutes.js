import { Router } from "express";
import { QuestsController } from "../controllers/questsController.js";

const router = Router();

/**
 * @swagger
 * /users/quests:
 *   get:
 *     tags: [Quests]
 *     summary: View all quests and progress
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quests returned
 */
router.get("/quests", QuestsController.getQuests);

/**
 * @swagger
 * /users/quests/claim:
 *   post:
 *     tags: [Quests]
 *     summary: Claim a completed quest
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [questId]
 *             properties:
 *               questId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quest claimed
 */
router.post("/quests/claim", QuestsController.claimQuest);

export default router;