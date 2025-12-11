const express = require("express");
const router = express.Router();
const avvisoController = require("../controllers/avvisoController");

/**
 * @swagger
 * /api/v1/avvisi:
 *   get:
 *     summary: Get list of notices
 *     description: Retrieve a list of all notices (avvisi). Returns an array of avviso objects with details including titolo, tipo (asso/comu), data, messaggio, and references to comune or associazione.
 *     tags:
 *       - Avvisi
 *     responses:
 *       200:
 *         description: Successfully retrieved list of avvisi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avviso'
 *       500:
 *         description: Error retrieving avvisi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving avvisi'
 *                 error:
 *                   type: object
 */
router.get("/", avvisoController.getAllAvvisi);

/**
 * @swagger
 * /api/v1/avvisi:
 *   post:
 *     summary: Create a new notice
 *     description: Create a new avviso with the provided information. The notice can be created by an associazione or comune, with different required fields based on the tipo.
 *     tags:
 *       - Avvisi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Avviso'
 *     responses:
 *       201:
 *         description: Avviso created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avviso'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid input data'
 *       500:
 *         description: Error creating avviso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating avviso'
 *                 error:
 *                   type: object
 */
router.post("/", avvisoController.createAvviso);

/**
 * @swagger
 * /api/v1/avvisi/{id}:
 *   get:
 *     summary: Get notice by ID
 *     description: Retrieve a single avviso by its unique identifier
 *     tags:
 *       - Avvisi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the avviso
 *     responses:
 *       200:
 *         description: Successfully retrieved avviso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avviso'
 *       404:
 *         description: Avviso not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Avviso not found'
 *       500:
 *         description: Error retrieving avviso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving avviso'
 *                 error:
 *                   type: object
 */
router.get("/:id", avvisoController.getAvvisoById);

/**
 * @swagger
 * /api/v1/avvisi/{id}:
 *   put:
 *     summary: Update notice by ID
 *     description: Update an existing avviso with new information
 *     tags:
 *       - Avvisi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the avviso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Avviso'
 *     responses:
 *       200:
 *         description: Avviso updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avviso'
 *       404:
 *         description: Avviso not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Avviso not found'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid input data'
 *       500:
 *         description: Error updating avviso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating avviso'
 *                 error:
 *                   type: object
 */
router.put("/:id", avvisoController.updateAvviso);

/**
 * @swagger
 * /api/v1/avvisi/{id}:
 *   delete:
 *     summary: Delete notice by ID
 *     description: Remove an existing avviso from the system
 *     tags:
 *       - Avvisi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the avviso
 *     responses:
 *       200:
 *         description: Avviso deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Avviso deleted successfully'
 *       404:
 *         description: Avviso not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Avviso not found'
 *       500:
 *         description: Error deleting avviso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting avviso'
 *                 error:
 *                   type: object
 */
router.delete("/:id", avvisoController.deleteAvviso);
module.exports = router;