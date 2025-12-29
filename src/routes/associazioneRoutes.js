const express = require("express");
const router = express.Router();
const associazioneController = require("../controllers/associazioneController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

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
 *     description: Create a new association with the provided information. Only accessible by municipality users.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only municipality users can create associations
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
router.post("/", checkToken, checkRole(['comu']), associazioneController.createAssociazione);

/**
 * @swagger
 * /api/v1/associazioni/{id}:
 *   put:
 *     summary: Update associazione by ID
 *     description: Update an existing association with new information. Accessible by association admins and municipality users.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only association admins or municipality users can update
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
router.put("/:id", checkToken, checkRole(['asso', 'comu']), associazioneController.updateAssociazione);

/**
 * @swagger
 * /api/v1/associazioni/{id}:
 *   delete:
 *     summary: Delete associazione by ID
 *     description: Delete an association by its unique identifier. Only accessible by municipality users.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only municipality users can delete associations
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
router.delete("/:id", checkToken, checkRole(['comu']), associazioneController.deleteAssociazione);

/**
 * @swagger
 * /api/v1/associazioni/{id}/membri:
 *   get:
 *     summary: Get all members of an associazione
 *     description: Retrieve a list of all users (utenti) who are members of a specific association. Accessible by association and municipality users.
 *     security:
 *       - bearerAuth: []
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
 *         description: Successfully retrieved members list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 associazione:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                 count:
 *                   type: integer
 *                   description: Number of members
 *                 membri:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       cognome:
 *                         type: string
 *                       email:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       admin:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only association and municipality users can view members
 *       500:
 *         description: Error retrieving members
 */
router.get("/:id/membri", checkToken, checkRole(['asso', 'comu']), associazioneController.getMembers);

/**
 * @swagger
 * /api/v1/associazioni/{id}/membri:
 *   post:
 *     summary: Add a member to an associazione
 *     description: Add an existing user as a member of the association. The user's type will be changed to 'asso' and linked to this association. Only accessible by association admins (RF22).
 *     security:
 *       - bearerAuth: []
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
 *             type: object
 *             required:
 *               - utenteId
 *             properties:
 *               utenteId:
 *                 type: string
 *                 description: MongoDB ObjectId of the user to add as member
 *                 example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Membro aggiunto con successo'
 *                 data:
 *                   type: object
 *                   properties:
 *                     utente:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nome:
 *                           type: string
 *                         cognome:
 *                           type: string
 *                         email:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                           example: 'asso'
 *                     associazione:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nome:
 *                           type: string
 *       400:
 *         description: Bad request - User already member or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Membro già presente nell''associazione'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only association admins can add members
 *       404:
 *         description: Associazione or Utente not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error adding member
 */
router.post("/:id/membri", checkToken, checkRole(['asso'], true), associazioneController.addMember);

/**
 * @swagger
 * /api/v1/associazioni/{id}/membri/{utenteId}:
 *   delete:
 *     summary: Remove a member from an associazione
 *     description: Remove a user from the association. The user's type will be changed back to 'citt' (citizen) and the association link will be removed. Only accessible by association admins (RF22).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Associazioni
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the associazione
 *       - in: path
 *         name: utenteId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Membro rimosso con successo'
 *                 data:
 *                   type: object
 *                   properties:
 *                     utente:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nome:
 *                           type: string
 *                         cognome:
 *                           type: string
 *                         email:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                           example: 'citt'
 *       400:
 *         description: User is not a member of this association
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Membro non trovato in questa associazione'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only association admins can remove members
 *       404:
 *         description: Associazione or Utente not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error removing member
 */
router.delete("/:id/membri/:utenteId", checkToken, checkRole(['asso'], true), associazioneController.removeMember);

module.exports = router;