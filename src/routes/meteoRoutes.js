const express = require("express");
const router = express.Router();
const meteoController = require("../controllers/meteoController");

/**
 * @swagger
 * /api/v1/meteo:
 *   get:
 *     summary: Get list of meteorological observations
 *     description: Retrieve a list of all meteorological observations (meteo). Returns an array of meteo objects with details including geographic coordinates, timestamp, and reading data.
 *     tags:
 *       - Meteo
 *     responses:
 *       200:
 *         description: Successfully retrieved list of meteo observations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meteo'
 *       500:
 *         description: Error retrieving meteo observations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving meteo observations'
 *                 error:
 *                   type: object
 */
router.get("/", meteoController.getAllMeteo);

/**
 * @swagger
 * /api/v1/meteo/{id}:
 *   get:
 *     summary: Get meteorological observation by ID
 *     description: Retrieve a single meteorological observation by its unique identifier
 *     tags:
 *       - Meteo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the meteo observation
 *     responses:
 *       200:
 *         description: Successfully retrieved meteo observation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meteo'
 *       404:
 *         description: Meteo observation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Meteo observation not found'
 *       500:
 *         description: Error retrieving meteo observation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving meteo observation'
 *                 error:
 *                   type: object
 */
router.get("/:id", meteoController.getMeteoById);
// Implementazione specifiche per meteo
/*
    richiesta con limite di date
    richiesta per località geografica
    get last rilevazione meteo per la maggior parte delle richieste, sarà necessario implementarla per ottimizzare le performance
*/
module.exports = router;