import { Router } from "express";
import { FusionsController } from "../controllers/fusionsController.js";

const router = Router();

/**
 * @swagger
 * /users/convert:
 *   post:
 *     tags: [Fusions]
 *     summary: Convert a duplicate servant to quartz
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
 *             required: [servantId]
 *             properties:
 *               servantId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Converted
 */
router.post("/convert", FusionsController.convertDuplicate);

/**
 * @swagger
 * /users/trade-up:
 *   post:
 *     tags: [Fusions]
 *     summary: Trade 3 duplicates for a higher rarity servant
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
 *             required: [servantId]
 *             properties:
 *               servantId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Traded up
 */
router.post("/trade-up", FusionsController.tradeUp);

/**
 * @swagger
 * /users/fusions:
 *   get:
 *     tags: [Fusions]
 *     summary: View fusion history
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History returned
 */
router.get("/fusions", FusionsController.getHistory);

export default router;