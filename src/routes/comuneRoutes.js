const express = require("express");
const router = express.Router();
const comuneController = require("../controllers/comuneController");

/**
 * @swagger
 * /api/v1/comune:
 *   get:
 *     summary: Get list of comuni
 *     description: Retrieve a list of all comuni (municipalities). Returns an array of comune objects with their details.
 *     tags:
 *       - Comune
 *     responses:
 *       200:
 *         description: Successfully retrieved list of comuni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comune'
 *       500:
 *         description: Error retrieving comuni
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nel recupero dei comuni'
 *                 error:
 *                   type: string
 */
router.get("/", comuneController.getAllComuni);

/**
 * @swagger
 * /api/v1/comune/{id}:
 *   get:
 *     summary: Get comune by ID
 *     description: Retrieve a single municipality by its unique identifier
 *     tags:
 *       - Comune
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comune
 *     responses:
 *       200:
 *         description: Successfully retrieved comune
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comune'
 *       404:
 *         description: Comune not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comune non trovato'
 *       500:
 *         description: Error retrieving comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nel recupero del comune'
 *                 error:
 *                   type: string
 */
router.get("/:id", comuneController.getComuneById);

/**
 * @swagger
 * /api/v1/comune:
 *   post:
 *     summary: Create a new comune
 *     description: Create a new municipality with the provided information
 *     tags:
 *       - Comune
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comune'
 *     responses:
 *       201:
 *         description: Comune created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comune'
 *       400:
 *         description: Invalid data or duplicate entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Dati non validi o duplicati'
 *                 error:
 *                   type: string
 *       500:
 *         description: Error creating comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nella creazione del comune'
 *                 error:
 *                   type: string
 */
router.post("/", comuneController.createComune);

/**
 * @swagger
 * /api/v1/comune/{id}:
 *   put:
 *     summary: Update comune by ID
 *     description: Update an existing municipality with new information
 *     tags:
 *       - Comune
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comune
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comune'
 *     responses:
 *       200:
 *         description: Comune updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comune'
 *       400:
 *         description: Invalid update data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Dati aggiornati non validi'
 *                 error:
 *                   type: string
 *       404:
 *         description: Comune not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comune non trovato'
 *       500:
 *         description: Error updating comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore nell'aggiornamento del comune"
 *                 error:
 *                   type: string
 */
router.put("/:id", comuneController.updateComune);

/**
 * @swagger
 * /api/v1/comune/{id}:
 *   delete:
 *     summary: Delete comune by ID
 *     description: Delete a municipality by its unique identifier
 *     tags:
 *       - Comune
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comune
 *     responses:
 *       200:
 *         description: Comune deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comune eliminato con successo'
 *       404:
 *         description: Comune not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comune non trovato'
 *       500:
 *         description: Error deleting comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore durante l'eliminazione"
 *                 error:
 *                   type: string
 */
router.delete("/:id", comuneController.deleteComune);

module.exports = router;