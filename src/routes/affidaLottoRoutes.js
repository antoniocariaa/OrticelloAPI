const express = require("express");
const router = express.Router();
const affidaLottoController = require("../controllers/affidaLottoController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

/**
 * @swagger
 * /api/v1/affidaLotti:
 *   get:
 *     summary: Get list of lotto assignments
 *     description: Retrieve a list of all lotto assignments (affidaLotti). Returns an array showing which users have been assigned to which lotti, including assignment dates and optional colture information. Accessible to **Comune** and **Associazioni**.
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of affida lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaLotto'
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       403:
 *         description: Forbidden - Insufficient permissions 
 *       500:
 *         description: Error retrieving affida lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving affida lotti'
 *                 error:
 *                   type: object
 */
router.get(
  "/",
  checkToken,
  checkRole(['comu', 'asso']),
  affidaLottoController.getAllAffidaLotti
);

/**
 * @swagger
 * /api/v1/affidaLotti/attivi:
 *   get:
 *     summary: Get active lotto assignments
 *     description: Retrieve only lotto assignments that have already started and not yet ended (data_inizio <= now <= data_fine). Results include populated lotto and utente data and are sorted by end date. Accessible to **Comune** and **Associazini**
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of active affida lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaLotto'
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       403:
 *         description: Forbidden - Insufficient permissions 
 *       500:
 *         description: Error retrieving active affida lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving active affida lotti'
 *                 error:
 *                   type: object
 */
router.get(
  "/attivi",
  checkToken,
  checkRole(['comu', 'asso','citt']),
  affidaLottoController.getAffidaLottiAttivi
);

/**
 * @swagger
 * /api/v1/affidaLotti:
 *   post:
 *     summary: Create a new lotto assignment
 *     description: Create a new assignment of a lotto to a user with start and end dates, and optionally a list of crops. Accessible to authenticated users
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AffidaLotto'
 *     responses:
 *       201:
 *         description: AffidaLotto created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
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
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       403:
 *         description: Forbidden - Insufficient permissions 
 *       500:
 *         description: Error creating affida lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating affida lotto'
 *                 error:
 *                   type: object
 */
// RF6.3: Richiesta Cittadino
// RF18: Assegnazione Comune / Associazione
router.post(
  "/",
  checkToken,
  checkRole(['citt', 'asso', 'comu']),
  affidaLottoController.createAffidaLotto
);

/**
 * @swagger
 * /api/v1/affidaLotti/{id}:
 *   get:
 *     summary: Get lotto assignment by ID
 *     description: Retrieve a single lotto assignment by its unique identifier
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida lotto
 *     responses:
 *       200:
 *         description: Successfully retrieved affida lotto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       404:
 *         description: AffidaLotto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
 *       500:
 *         description: Error retrieving affida lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving affida lotto'
 *                 error:
 *                   type: object
 */
router.get(
  "/:id",
  checkToken,
  affidaLottoController.getAffidaLottoById
);

/**
 * @swagger
 * /api/v1/affidaLotti/{id}:
 *   put:
 *     summary: Update lotto assignment by ID
 *     description: Update an existing lotto assignment with new information (dates, colture, etc.). Used by **Comune** and **Associazioni**
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida lotto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AffidaLotto'
 *     responses:
 *       200:
 *         description: AffidaLotto updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
 *       404:
 *         description: AffidaLotto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
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
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       403:
 *         description: Forbidden - Insufficient permissions 
 *       500:
 *         description: Error updating affida lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating affida lotto'
 *                 error:
 *                   type: object
 */
// RF25: Modifica / approvazione affido
router.put(
  "/:id",
  checkToken,
  checkRole(['asso', 'comu']),
  affidaLottoController.updateAffidaLotto
);

/**
 * @swagger
 * /api/v1/affidaLotti/{id}:
 *   delete:
 *     summary: Delete lotto assignment by ID
 *     description: Remove an existing lotto assignment from the system. Accessible ony to **Comune** and **Associazioni**
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida lotto
 *     responses:
 *       200:
 *         description: AffidaLotto deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto deleted successfully'
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       403:
 *         description: Forbidden - Insufficient permissions 
 *       404:
 *         description: AffidaLotto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
 *       500:
 *         description: Error deleting affida lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting affida lotto'
 *                 error:
 *                   type: object
 */
router.delete(
  "/:id",
  checkToken,
  checkRole(['asso', 'comu']),
  affidaLottoController.deleteAffidaLotto
);

// --- NUOVE ROTTE ---
/**
 * @swagger
 * /api/v1/affidaLotti/{id}/colture:
 *   post:
 *     summary: Add a crop to lotto assignment
 *     description: Add a new crop (coltura) to the list of crops for a specific lotto assignment. Accessible only to the **Cittadino** owning the assignment
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida lotto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coltura:
 *                 type: string
 *                 description: Name of the crop to add
 *                 example: 'Pomodori'
 *     responses:
 *       200:
 *         description: Coltura added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
 *       404:
 *         description: AffidaLotto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Coltura name is required'
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       403:
 *         description: Forbidden - Insufficient permissions 
 *       500:
 *         description: Error adding coltura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error adding coltura'
 *                 error:
 *                   type: object
 */
router.post(
  "/:id/colture",
  checkToken,
  checkRole(['citt']),
  affidaLottoController.addColtura
);

/**
 * @swagger
 * /api/v1/affidaLotti/{id}/colture/{coltura}:
 *   delete:
 *     summary: Remove a crop from lotto assignment
 *     description: Remove a specific crop (coltura) from the list of crops for a lotto assignment
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida lotto
 *       - in: path
 *         name: coltura
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the crop to remove
 *     responses:
 *       200:
 *         description: Coltura removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
 *       401:
 *         description: Unauthorized - Authentication required (missing or invalid JWT token)
 *       403:
 *         description: Forbidden - Insufficient permissions 
 *       404:
 *         description: AffidaLotto not found or coltura not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found or coltura not found'
 *       500:
 *         description: Error removing coltura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error removing coltura'
 *                 error:
 *                   type: object
 */
router.delete(
  "/:id/colture/:coltura",
  checkToken,
  checkRole(['citt']),
  affidaLottoController.removeColtura
);

module.exports = router;
