const express = require("express");
const router = express.Router();
const bandoController = require("../controllers/bandoController");

/**
 * @swagger
 * /api/v1/bandi:
 *   get:
 *     summary: Get list of announcements
 *     description: Retrieve a list of all announcements (bandi). Returns an array of bando objects with details including titolo, data_inizio, data_fine, messaggio, and optional link.
 *     tags:
 *       - Bandi
 *     responses:
 *       200:
 *         description: Successfully retrieved list of bandi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bando'
 *       500:
 *         description: Error retrieving bandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving bandi'
 *                 error:
 *                   type: object
 */
router.get("/", bandoController.getAllBandi);

/**
 * @swagger
 * /api/v1/bandi:
 *   post:
 *     summary: Create a new announcement
 *     description: Create a new bando with the provided information including title, start and end dates, message, and optional link
 *     tags:
 *       - Bandi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bando'
 *     responses:
 *       201:
 *         description: Bando created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bando'
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
 *         description: Error creating bando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating bando'
 *                 error:
 *                   type: object
 */
router.post("/", bandoController.createBando);

/**
 * @swagger
 * /api/v1/bandi/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     description: Retrieve a single bando by its unique identifier
 *     tags:
 *       - Bandi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the bando
 *     responses:
 *       200:
 *         description: Successfully retrieved bando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bando'
 *       404:
 *         description: Bando not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Bando not found'
 *       500:
 *         description: Error retrieving bando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving bando'
 *                 error:
 *                   type: object
 */
router.get("/:id", bandoController.getBandoById);

/**
 * @swagger
 * /api/v1/bandi/{id}:
 *   put:
 *     summary: Update announcement by ID
 *     description: Update an existing bando with new information
 *     tags:
 *       - Bandi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the bando
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bando'
 *     responses:
 *       200:
 *         description: Bando updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bando'
 *       404:
 *         description: Bando not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Bando not found'
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
 *         description: Error updating bando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating bando'
 *                 error:
 *                   type: object
 */
router.put("/:id", bandoController.updateBando);

/**
 * @swagger
 * /api/v1/bandi/{id}:
 *   delete:
 *     summary: Delete announcement by ID
 *     description: Remove an existing bando from the system
 *     tags:
 *       - Bandi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the bando
 *     responses:
 *       200:
 *         description: Bando deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Bando deleted successfully'
 *       404:
 *         description: Bando not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Bando not found'
 *       500:
 *         description: Error deleting bando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting bando'
 *                 error:
 *                   type: object
 */
router.delete("/:id", bandoController.deleteBando);

module.exports = router;