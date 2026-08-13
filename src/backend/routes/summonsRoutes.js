import { Router } from "express";
import { SummonsController } from "../controllers/summonsController.js";

const router = Router();

/**
 * @swagger
 * /users/summon:
 *   post:
 *     tags: [Summons]
 *     summary: Single summon (costs 3 quartz)
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Servant summoned
 */
router.post("/summon", SummonsController.singleSummon);

/**
 * @swagger
 * /users/multi-summon:
 *   post:
 *     tags: [Summons]
 *     summary: Multi-summon 10+1 (costs 30 quartz)
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 11 servants summoned
 */
router.post("/multi-summon", SummonsController.multiSummon);

/**
 * @swagger
 * /users/servants:
 *   get:
 *     tags: [Summons]
 *     summary: View servant collection
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *       - in: query
 *         name: rarity
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Collection returned
 */
router.get("/servants", SummonsController.getCollection);

export default router;