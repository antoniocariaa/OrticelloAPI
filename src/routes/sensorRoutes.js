const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

/**
 * @swagger
 * /api/v1/sensor:
 *   get:
 *     summary: Get list of sensor readings
 *     description: Retrieve a list of all sensor readings. Returns an array of sensor objects with details including lotto reference, timestamp, and reading data.
 *     tags:
 *       - Sensor
 *     responses:
 *       200:
 *         description: Successfully retrieved list of sensor readings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 *       500:
 *         description: Error retrieving sensor readings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving sensor readings'
 *                 error:
 *                   type: object
 */
router.get("/", sensorController.getAllSensors);

/**
 * @swagger
 * /api/v1/sensor/{id}:
 *   get:
 *     summary: Get sensor reading by ID
 *     description: Retrieve a single sensor reading by its unique identifier
 *     tags:
 *       - Sensor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the sensor reading
 *     responses:
 *       200:
 *         description: Successfully retrieved sensor reading
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: Sensor reading not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Sensor reading not found'
 *       500:
 *         description: Error retrieving sensor reading
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving sensor reading'
 *                 error:
 *                   type: object
 */
router.get("/:id", sensorController.getSensorById);
// Implementazione specifiche per sensori
/*
    richiesta con limite di date
    richiesta per località geografica
    get last rilevazione sensore per la maggior parte delle richieste, sarà necessario implementarla per ottimizzare le performance
*/
module.exports = router;    

