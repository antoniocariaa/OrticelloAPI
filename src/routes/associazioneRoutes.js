const express = require("express");
const router = express.Router();
const associazioneController = require("../controllers/associazioneController");

/**
 * @swagger
 * /api/v1/associazioni:
 *   get:
 *     summary: Get list of associazioni
 *     description: Retrieve a list of all associazioni (associations). Returns an array of associazione objects with their details.
 *     tags:
 *       - Associazioni
 *     responses:
 *       200:
 *         description: Successfully retrieved list of associazioni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Associazione'
 *       500:
 *         description: Error retrieving associazioni
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nel recupero delle associazioni'
 *                 error:
 *                   type: string
 */
router.get("/", associazioneController.getAllAssociazioni);

/**
 * @swagger
 * /api/v1/associazioni/{id}:
 *   get:
 *     summary: Get associazione by ID
 *     description: Retrieve a single association by its unique identifier
 *     tags:
 *       - Associazioni
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the associazione
 *     responses:
 *       200:
 *         description: Successfully retrieved associazione
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Associazione'
 *       404:
 *         description: Associazione not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Associazione non trovata'
 *       500:
 *         description: Error retrieving associazione
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore nel recupero dell'associazione"
 *                 error:
 *                   type: string
 */
router.get("/:id", associazioneController.getAssociazioneById);

/**
 * @swagger
 * /api/v1/associazioni:
 *   post:
 *     summary: Create a new associazione
 *     description: Create a new association with the provided information
 *     tags:
 *       - Associazioni
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Associazione'
 *     responses:
 *       201:
 *         description: Associazione created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Associazione'
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
 *         description: Error creating associazione
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore nella creazione dell'associazione"
 *                 error:
 *                   type: string
 */
router.post("/", associazioneController.createAssociazione);

/**
 * @swagger
 * /api/v1/associazioni/{id}:
 *   put:
 *     summary: Update associazione by ID
 *     description: Update an existing association with new information
 *     tags:
 *       - Associazioni
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the associazione
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Associazione'
 *     responses:
 *       200:
 *         description: Associazione updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Associazione'
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
 *         description: Associazione not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Associazione non trovata'
 *       500:
 *         description: Error updating associazione
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore nell'aggiornamento dell'associazione"
 *                 error:
 *                   type: string
 */
router.put("/:id", associazioneController.updateAssociazione);

/**
 * @swagger
 * /api/v1/associazioni/{id}:
 *   delete:
 *     summary: Delete associazione by ID
 *     description: Delete an association by its unique identifier
 *     tags:
 *       - Associazioni
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the associazione
 *     responses:
 *       200:
 *         description: Associazione deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Associazione eliminata con successo'
 *       404:
 *         description: Associazione not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Associazione non trovata'
 *       500:
 *         description: Error deleting associazione
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
router.delete("/:id", associazioneController.deleteAssociazione);

module.exports = router;