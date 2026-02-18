const express = require("express");
const router = express.Router();
const consigliController = require("../controllers/consigliController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

/**
 * @swagger
 * /api/v1/consigli:
 *   post:
 *     summary: Get AI-powered gardening tips
 *     description: |
 *       Generate personalized gardening tips based on the user's crops and current weather conditions.
 *       Uses Google Gemini AI to provide contextual advice.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Cittadini** - Only citizens with assigned plots can request tips
 *     tags:
 *       - Consigli
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - colture
 *             properties:
 *               colture:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of crops the citizen is growing
 *                 example: ['Pomodori', 'Zucchine', 'Basilico']
 *               weather:
 *                 type: object
 *                 description: Current weather conditions (optional)
 *                 properties:
 *                   temperature:
 *                     type: number
 *                     example: 18.5
 *                   humidity:
 *                     type: number
 *                     example: 65
 *                   windSpeed:
 *                     type: number
 *                     example: 12
 *                   condition:
 *                     type: string
 *                     example: 'Nuvoloso'
 *     responses:
 *       200:
 *         description: Tips generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consigli:
 *                   type: string
 *                   description: AI-generated gardening tips
 *       400:
 *         description: Missing or invalid crops data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error generating tips (API key missing or AI service error)
 */
router.post(
    "/",
    checkToken,
    checkRole(['citt']),
    consigliController.getConsigli
);

module.exports = router;
