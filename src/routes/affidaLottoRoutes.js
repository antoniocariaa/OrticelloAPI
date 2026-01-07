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
 *     description: |
 *       Retrieve a list of all lotto assignments (affidaLotti). Returns an array showing which 
 *       users have been assigned to which lotti, including assignment dates and optional colture 
 *       information.
 *       
 *       **Access Control:**
 *       - **Comune**: Can view all lotto assignments
 *       - **Associazioni**: Can view assignments within their managed orti
 *       - **Cittadini**: Can view assignments (for map visualization)
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
 *         description: Forbidden - User does not have the required role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       500:
 *         description: Internal server error while retrieving affida lotti
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
  checkRole(['comu', 'asso', 'citt']),
  affidaLottoController.getAllAffidaLotti
);

/**
 * @swagger
 * /api/v1/affidaLotti/attivi:
 *   get:
 *     summary: Get active lotto assignments
 *     description: |
 *       Retrieve only lotto assignments that have already started and not yet ended 
 *       (data_inizio <= now <= data_fine). Results include populated lotto and utente data 
 *       and are sorted by end date. Used to filter occupied lots on the map.
 *       
 *       **Access Control:**
 *       - **Comune**: Can view all active assignments
 *       - **Associazioni**: Can view active assignments within their managed orti
 *       - **Cittadini**: Can view active assignments (for map visualization)
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
 *         description: Forbidden - User does not have the required role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       500:
 *         description: Internal server error while retrieving active affida lotti
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
  checkRole(['comu', 'asso', 'citt']),
  affidaLottoController.getAffidaLottiAttivi
);

/**
 * @swagger
 * /api/v1/affidaLotti/pending:
 *   get:
 *     summary: Get pending lotto assignment requests
 *     description: |
 *       Retrieve all lotto assignment requests that are in pending status, awaiting approval
 *       from associations. Returns a list of requests sorted by request date (most recent first).
 *       
 *       **Access Control:**
 *       - **Comune**: Can view all pending requests across all orti
 *       - **Associazioni**: Can view pending requests for lotti in their managed orti
 *       
 *       **Business Rules:**
 *       - RF6.3: Citizens request lotto assignments
 *       - RF18: Associations/Comune approve or reject requests
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaLotto'
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
 *         description: Forbidden - User does not have the required role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       500:
 *         description: Internal server error while retrieving pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving pending requests'
 *                 error:
 *                   type: object
 */
router.get(
  "/pending",
  checkToken,
  checkRole(['comu', 'asso']),
  affidaLottoController.getRichiestePending
);

/**
 * @swagger
 * /api/v1/affidaLotti/storico:
 *   get:
 *     summary: Get historical lotto assignments (accepted and rejected)
 *     description: |
 *       Retrieve the history of lotto assignments that have been accepted or rejected.
 *       
 *       **Access Control and Filtering:**
 *       - **Comune**: Can view all historical assignments across all orti
 *       - **Associazioni**: Can view only assignments for lotti within their managed orti
 *       
 *       Returns assignments with status 'accepted' or 'rejected', sorted by request date
 *       (most recent first). Useful for viewing past decisions and assignment history.
 *       
 *       **Business Rules:**
 *       - Shows completed request workflow (approved or rejected)
 *       - Filtered by association's managed orti for transparency
 *     tags:
 *       - AffidaLotti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved historical assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaLotto'
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
 *         description: Forbidden - User does not have the required role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       500:
 *         description: Internal server error while retrieving historical assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving historical assignments'
 *                 error:
 *                   type: object
 */
router.get(
  "/storico",
  checkToken,
  checkRole(['comu', 'asso']),
  affidaLottoController.getStoricoAssegnazioni
);

/**
 * @swagger
 * /api/v1/affidaLotti/{id}:
 *   get:
 *     summary: Get lotto assignment by ID
 *     description: |
 *       Retrieve a single lotto assignment by its unique MongoDB ObjectId. Returns detailed 
 *       information including the assigned lotto, user, dates, and crops.
 *       
 *       **Access Control:**
 *       - Accessible to all authenticated users
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
 *         example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved affida lotto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
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
 *         description: AffidaLotto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
 *       500:
 *         description: Internal server error while retrieving affida lotto
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
 * /api/v1/affidaLotti:
 *   post:
 *     summary: Create a new lotto assignment request
 *     description: |
 *       Create a new lotto assignment or assignment request. The behavior varies based on user role:
 *       - **Cittadini**: Create a request for a lotto (RF6.3) - dates are optional/pending approval
 *       - **Comune/Associazioni**: Directly assign a lotto with confirmed dates (RF18)
 *       
 *       Optionally includes a list of crops (colture) the user plans to cultivate.
 *       
 *       **Business Rules:**
 *       - RF6.3: Richiesta Cittadino
 *       - RF18: Assegnazione diretta Comune/Associazione
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
 *           example:
 *             lotto: '507f1f77bcf86cd799439011'
 *             utente: '507f191e810c19729de860ea'
 *             data_inizio: '2024-03-01'
 *             data_fine: '2024-12-31'
 *             colture: ['Pomodori', 'Zucchine', 'Basilico']
 *     responses:
 *       201:
 *         description: AffidaLotto created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
 *       400:
 *         description: Invalid input data - Missing required fields or invalid format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid input data'
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
 *         description: Forbidden - User does not have the required role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       500:
 *         description: Internal server error while creating affida lotto
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
router.post(
  "/",
  checkToken,
  checkRole(['citt', 'asso', 'comu']),
  affidaLottoController.createAffidaLotto
);

/**
 * @swagger
 * /api/v1/affidaLotti/{id}/gestisci:
 *   put:
 *     summary: Approve or reject a lotto assignment request
 *     description: |
 *       Allows **Associazione** or **Comune** to approve or reject a citizen's lotto assignment 
 *       request.
 *       
 *       **Actions:**
 *       - **accetta**: Approves the request and sets start/end dates, making the assignment active
 *       - **rifiuta**: Rejects and deletes the request
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Associazioni and Comune users**
 *       
 *       This is a fundamental route for the request approval workflow.
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
 *         description: MongoDB ObjectId of the affida lotto request
 *         example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - azione
 *             properties:
 *               azione:
 *                 type: string
 *                 enum: [accetta, rifiuta]
 *                 description: Action to perform on the request
 *               data_inizio:
 *                 type: string
 *                 format: date
 *                 description: Start date (required if azione is 'accetta')
 *               data_fine:
 *                 type: string
 *                 format: date
 *                 description: End date (required if azione is 'accetta')
 *           example:
 *             azione: 'accetta'
 *             data_inizio: '2024-03-01'
 *             data_fine: '2024-12-31'
 *     responses:
 *       200:
 *         description: Request processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Richiesta accettata con successo'
 *                 affidaLotto:
 *                   $ref: '#/components/schemas/AffidaLotto'
 *       400:
 *         description: Invalid action or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Azione non valida o dati mancanti'
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
 *         description: Forbidden - Only Associazioni and Comune can manage requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: AffidaLotto request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Richiesta non trovata'
 *       500:
 *         description: Internal server error while processing request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Errore nella gestione della richiesta'
 *                 error:
 *                   type: object
 */
router.put(
  "/:id/gestisci",
  checkToken,
  checkRole(['asso', 'comu']),
  affidaLottoController.gestisciRichiesta
);

/**
 * @swagger
 * /api/v1/affidaLotti/{id}:
 *   put:
 *     summary: Update lotto assignment by ID
 *     description: |
 *       Update an existing lotto assignment with new information such as dates, notes, or 
 *       other attributes. Generic update endpoint for assignment modifications.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Associazioni and Comune users**
 *       
 *       **Business Rule:** RF25 - Modifica/approvazione affido
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
 *         description: MongoDB ObjectId of the affida lotto to update
 *         example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AffidaLotto'
 *           example:
 *             data_inizio: '2024-03-15'
 *             data_fine: '2025-03-14'
 *             note: 'Estensione periodo di assegnazione'
 *     responses:
 *       200:
 *         description: AffidaLotto updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
 *       400:
 *         description: Invalid input data - Missing required fields or invalid format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid input data'
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
 *         description: Forbidden - Only Associazioni and Comune can update assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: AffidaLotto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
 *       500:
 *         description: Internal server error while updating affida lotto
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
 *     description: |
 *       Remove an existing lotto assignment from the system. This permanently deletes the 
 *       assignment record.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Associazioni and Comune users**
 *       
 *       **Warning:** This operation cannot be undone. Consider the impact on historical 
 *       records and user assignments.
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
 *         description: MongoDB ObjectId of the affida lotto to delete
 *         example: '507f1f77bcf86cd799439011'
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
 *         description: Forbidden - Only Associazioni and Comune can delete assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: AffidaLotto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
 *       500:
 *         description: Internal server error while deleting affida lotto
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

/**
 * @swagger
 * /api/v1/affidaLotti/{id}/colture:
 *   post:
 *     summary: Add a crop to lotto assignment
 *     description: |
 *       Add a new crop (coltura) to the list of crops for a specific lotto assignment. 
 *       This allows citizens to track what they're growing on their assigned plot.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Cittadini** - Only the owner of the assignment can add crops
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
 *         example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coltura
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
 *       400:
 *         description: Invalid input data - Coltura name is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Coltura name is required'
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
 *         description: Forbidden - Only the assignment owner can add crops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: AffidaLotto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found'
 *       500:
 *         description: Internal server error while adding coltura
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
 *     description: |
 *       Remove a specific crop (coltura) from the list of crops for a lotto assignment. 
 *       Useful when a citizen changes what they're growing or harvests a crop.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Cittadini** - Only the owner of the assignment can remove crops
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
 *         example: '507f1f77bcf86cd799439011'
 *       - in: path
 *         name: coltura
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the crop to remove
 *         example: 'Pomodori'
 *     responses:
 *       200:
 *         description: Coltura removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaLotto'
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
 *         description: Forbidden - Only the assignment owner can remove crops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: AffidaLotto not found or coltura not found in the assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaLotto not found or coltura not found'
 *       500:
 *         description: Internal server error while removing coltura
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