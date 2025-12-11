const express = require("express");
const router = express.Router();
const utenteController = require("../controllers/utenteController");

/**
 * @swagger
 * /api/v1/utenti:
 *   get:
 *     summary: Get list of users
 *     description: Retrieve a list of all users (utenti). Returns an array of utente objects with their details including nome, cognome, email, tipo, and references to associazione or comune if applicable.
 *     tags:
 *       - Utenti
 *     responses:
 *       200:
 *         description: Successfully retrieved list of utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utente'
 *       500:
 *         description: Error retrieving utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving utenti'
 *                 error:
 *                   type: object
 */
router.get("/", utenteController.getAllUtenti);

/**
 * @swagger
 * /api/v1/utenti/{id}:
 *   get:
 *     summary: Get utente by ID
 *     description: Retrieve a single user by its unique identifier
 *     tags:
 *       - Utenti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the utente
 *     responses:
 *       200:
 *         description: Successfully retrieved utente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utente'
 *       404:
 *         description: Utente not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utente not found'
 *       500:
 *         description: Error retrieving utente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving utente'
 *                 error:
 *                   type: object
 */
router.get("/:id", utenteController.getUtenteById);
// TO DO: Aggiungere rotte per creazione, aggiornamento e cancellazione utenti

module.exports = router;