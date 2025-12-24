const express = require("express");
const router = express.Router();
const lottoController = require("../controllers/lottoController");

/**
 * @swagger
 * /api/v1/lotti:
 *   get:
 *     summary: Get list of lotti
 *     description: Retrieve a list of all lotti (plots). Returns an array of lotto objects with their details.
 *     tags:
 *       - Lotti
 *     responses:
 *       200:
 *         description: Successfully retrieved list of lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lotto'
 *       500:
 *         description: Error retrieving lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving lotti'
 *                 error:
 *                   type: object
 */
router.get("/", lottoController.getAllLotti);

/**
 * @swagger
 * /api/v1/lotti:
 *   post:
 *     summary: Create a new lotto
 *     description: Create a new plot with the provided information
 *     tags:
 *       - Lotti
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lotto'
 *     responses:
 *       201:
 *         description: Lotto created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lotto'
 *       500:
 *         description: Error creating lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating lotto'
 *                 error:
 *                   type: object
 */
router.post("/", lottoController.createLotto);

/**
 * @swagger
 * /api/v1/lotti/{id}:
 *   get:
 *     summary: Get lotto by ID
 *     description: Retrieve a single plot by its unique identifier
 *     tags:
 *       - Lotti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lotto
 *     responses:
 *       200:
 *         description: Successfully retrieved lotto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lotto'
 *       404:
 *         description: Lotto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto not found'
 *       500:
 *         description: Error retrieving lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving lotto'
 *                 error:
 *                   type: object
 */
router.get("/:id", lottoController.getLottoById);

/**
 * @swagger
 * /api/v1/lotti/{id}:
 *   put:
 *     summary: Update lotto by ID
 *     description: Update an existing plot with new information
 *     tags:
 *       - Lotti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lotto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lotto'
 *     responses:
 *       200:
 *         description: Lotto updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lotto'
 *       404:
 *         description: Lotto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto not found'
 *       500:
 *         description: Error updating lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating lotto'
 *                 error:
 *                   type: object
 */
router.put("/:id", lottoController.updateLotto);

/**
 * @swagger
 * /api/v1/lotti/{id}:
 *   delete:
 *     summary: Delete lotto by ID
 *     description: Delete a plot by its unique identifier
 *     tags:
 *       - Lotti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lotto
 *     responses:
 *       200:
 *         description: Lotto deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto deleted successfully'
 *       404:
 *         description: Lotto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto not found'
 *       500:
 *         description: Error deleting lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting lotto'
 *                 error:
 *                   type: object
 */
router.delete("/:id", lottoController.deleteLotto);

module.exports = router;