const express = require("express");
const router = express.Router();
const comuneController = require("../controllers/comuneController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

/**
 * @swagger
 * /api/v1/comune:
 *   get:
 *     summary: Get list of comuni
 *     description: |
 *       Retrieve a list of all comuni (municipalities). Returns an array of comune objects 
 *       with their complete details including name, address, contact information, and other 
 *       administrative data.
 *       
 *       **Access Control:**
 *       - Accessible to all authenticated users
 *     tags:
 *       - Comune
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of comuni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comune'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Internal server error while retrieving comuni
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nel recupero dei comuni'
 *                 error:
 *                   type: object
 */
router.get("/", 
    checkToken, 
    comuneController.getAllComuni
);

/**
 * @swagger
 * /api/v1/comune/{id}:
 *   get:
 *     summary: Get comune by ID
 *     description: |
 *       Retrieve a single municipality by its unique MongoDB ObjectId. Returns complete 
 *       details about the specific comune.
 *       
 *       **Access Control:**
 *       - Accessible to all authenticated users
 *     tags:
 *       - Comune
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comune
 *         example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved comune
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comune'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       404:
 *         description: Comune not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comune non trovato'
 *       500:
 *         description: Internal server error while retrieving comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nel recupero del comune'
 *                 error:
 *                   type: object
 */
router.get("/:id", 
    checkToken, 
    comuneController.getComuneById
);

/**
 * @swagger
 * /api/v1/comune:
 *   post:
 *     summary: Create a new comune
 *     description: |
 *       Create a new municipality entity with the provided information including administrative 
 *       details, contact information, and geographic data.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune Admin users only**
 *       
 *       Solo un Admin del Comune (o un SuperAdmin se esistesse) può creare l'entità Comune.
 *     tags:
 *       - Comune
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comune'
 *           example:
 *             nome: 'Bolzano'
 *             indirizzo: 'Piazza Municipio, 5'
 *             cap: '39100'
 *             provincia: 'BZ'
 *             telefono: '+39 0471 997111'
 *             email: 'info@comune.bolzano.it'
 *             pec: 'comune.bolzano@legalmail.it'
 *     responses:
 *       201:
 *         description: Comune created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comune'
 *       400:
 *         description: Invalid data or duplicate entry - Required fields missing or invalid format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Dati non validi o duplicati'
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       403:
 *         description: Forbidden - Only Comune Admin users can create municipalities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden - Insufficient privileges'
 *       500:
 *         description: Internal server error while creating comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nella creazione del comune'
 *                 error:
 *                   type: object
 */
router.post("/", 
    checkToken, 
    checkRole(['comu'], true), 
    comuneController.createComune
);

/**
 * @swagger
 * /api/v1/comune/{id}:
 *   put:
 *     summary: Update comune by ID
 *     description: |
 *       Update an existing municipality with new information. Allows modification of administrative 
 *       details, contact information, and other comune attributes.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune Admin users only**
 *       
 *       Solo l'Admin del Comune può modificare i dati dell'ente.
 *     tags:
 *       - Comune
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comune to update
 *         example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comune'
 *           example:
 *             nome: 'Bolzano'
 *             indirizzo: 'Piazza Municipio, 5'
 *             cap: '39100'
 *             provincia: 'BZ'
 *             telefono: '+39 0471 997111'
 *             email: 'info@comune.bolzano.it'
 *             pec: 'comune.bolzano@legalmail.it'
 *     responses:
 *       200:
 *         description: Comune updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comune'
 *       400:
 *         description: Invalid update data - Missing required fields or invalid format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Dati aggiornati non validi'
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       403:
 *         description: Forbidden - Only Comune Admin users can update municipalities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden - Insufficient privileges'
 *       404:
 *         description: Comune not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comune non trovato'
 *       500:
 *         description: Internal server error while updating comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore nell'aggiornamento del comune"
 *                 error:
 *                   type: object
 */
router.put("/:id", 
    checkToken, 
    checkRole(['comu'], true), 
    comuneController.updateComune
);

/**
 * @swagger
 * /api/v1/comune/{id}:
 *   delete:
 *     summary: Delete comune by ID
 *     description: |
 *       Delete a municipality by its unique identifier. This operation permanently removes 
 *       the comune from the system.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune Admin users only**
 *       
 *       **Warning:** This operation may have cascading effects on related entities (orti, 
 *       affidamenti, etc.). Use with caution.
 *     tags:
 *       - Comune
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comune to delete
 *         example: '507f1f77bcf86cd799439011'
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
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       403:
 *         description: Forbidden - Only Comune Admin users can delete municipalities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden - Insufficient privileges'
 *       404:
 *         description: Comune not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comune non trovato'
 *       500:
 *         description: Internal server error while deleting comune
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore durante l'eliminazione"
 *                 error:
 *                   type: object
 */
router.delete("/:id", 
    checkToken, 
    checkRole(['comu'], true), 
    comuneController.deleteComune
);

module.exports = router;