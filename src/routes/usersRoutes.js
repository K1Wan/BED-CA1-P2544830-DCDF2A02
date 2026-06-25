import { Router } from "express";
import { UsersController } from "../controllers/usersController.js";

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new Master
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Master created
 */
router.post("/", UsersController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Find Master by username
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Master found
 */
router.get("/", UsersController.getByUsername);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Find Master by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Master found
 *   put:
 *     tags: [Users]
 *     summary: Update Master username
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *   patch:
 *     tags: [Users]
 *     summary: Partially update Master
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [Users]
 *     summary: Delete a Master
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get("/:id", UsersController.getById);
router.put("/:id", UsersController.update);
router.patch("/:id", UsersController.update);
router.delete("/:id", UsersController.remove);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Claim daily login bonus
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Bonus claimed
 */
router.post("/login", UsersController.loginBonus);

export default router;