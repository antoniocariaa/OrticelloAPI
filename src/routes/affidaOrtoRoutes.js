const express = require("express");
const router = express.Router();
const affidaOrtoController = require("../controllers/affidaOrtoController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

/**
 * @swagger
 * /api/v1/affidaOrti:
 *   get:
 *     summary: Get list of orto assignments
 *     description: |
 *       Retrieve a list of all orto assignments (affidaOrti). Returns an array showing which associazioni 
 *       have been assigned to which orti, including assignment start and end dates.
 *       
 *       **Access Control:**
 *       - **Comune**: Can view all orto assignments
 *       - **Associazioni**: Can view only their own assignments
 *     tags:
 *       - AffidaOrti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of affida orti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaOrto'
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
 *         description: Internal server error while retrieving affida orti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving affida orti'
 *                 error:
 *                   type: object
 */
router.get("/", 
    checkToken, 
    checkRole(['comu', 'asso','citt']), 
    affidaOrtoController.getAllAffidaOrti
);

/**
 * @swagger
 * /api/v1/affidaOrti/active:
 *   get:
 *     summary: Get list of active orto assignments
 *     description: |
 *       Retrieve a list of orto assignments that are currently active (where today's date falls within 
 *       the assignment date range). Returns an array showing which associazioni are currently assigned 
 *       to which orti.
 *       
 *       **Access Control:**
 *       - **Comune**: Can view all active assignments
 *       - **Associazioni**: Can view only their own active assignments
 *     tags:
 *       - AffidaOrti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of active affida orti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaOrto'
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
 *         description: Internal server error while retrieving active affida orti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving active affida orti'
 *                 error:
 *                   type: object
 */
router.get("/active", 
    checkToken, 
    checkRole(['comu', 'asso','citt']), 
    affidaOrtoController.getActiveAffidaOrti
);

/**
 * @swagger
 * /api/v1/affidaOrti/{id}:
 *   get:
 *     summary: Get orto assignment by ID
 *     description: |
 *       Retrieve a single orto assignment by its unique MongoDB ObjectId. Returns detailed information 
 *       about the assignment including the associated orto and associazione.
 *       
 *       **Access Control:**
 *       - **Comune**: Can view any assignment
 *       - **Associazioni**: Can view only their own assignments
 *     tags:
 *       - AffidaOrti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida orto
 *         example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved affida orto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaOrto'
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
 *       404:
 *         description: AffidaOrto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaOrto not found'
 *       500:
 *         description: Internal server error while retrieving affida orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving affida orto'
 *                 error:
 *                   type: object
 */
router.get("/:id", 
    checkToken, 
    checkRole(['comu', 'asso']), 
    affidaOrtoController.getAffidaOrtoById
);

/**
 * @swagger
 * /api/v1/affidaOrti:
 *   post:
 *     summary: Create a new orto assignment
 *     description: |
 *       Create a new assignment of an orto to an associazione with start and end dates.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune users only (RF18)**
 *       
 *       **Business Rule (RF18):** Il Comune assegna gli orti alle associazioni
 *     tags:
 *       - AffidaOrti
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AffidaOrto'
 *           example:
 *             orto: '507f1f77bcf86cd799439011'
 *             associazione: '507f191e810c19729de860ea'
 *             dataInizio: '2024-01-01'
 *             dataFine: '2025-12-31'
 *     responses:
 *       201:
 *         description: AffidaOrto created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaOrto'
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
 *         description: Forbidden - Only Comune users can create orto assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden - Only Comune can create assignments'
 *       500:
 *         description: Internal server error while creating affida orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating affida orto'
 *                 error:
 *                   type: object
 */
router.post("/", 
    checkToken, 
    checkRole(['comu']), 
    affidaOrtoController.createAffidaOrto
);

/**
 * @swagger
 * /api/v1/affidaOrti/{id}:
 *   put:
 *     summary: Update orto assignment by ID
 *     description: |
 *       Update an existing orto assignment with new information (dates, orto, associazione).
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune users only**
 *       
 *       Solo il Comune gestisce i contratti macro di assegnazione degli orti.
 *     tags:
 *       - AffidaOrti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida orto to update
 *         example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AffidaOrto'
 *           example:
 *             orto: '507f1f77bcf86cd799439011'
 *             associazione: '507f191e810c19729de860ea'
 *             dataInizio: '2024-01-01'
 *             dataFine: '2026-12-31'
 *     responses:
 *       200:
 *         description: AffidaOrto updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaOrto'
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
 *         description: Forbidden - Only Comune users can update orto assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: AffidaOrto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaOrto not found'
 *       500:
 *         description: Internal server error while updating affida orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating affida orto'
 *                 error:
 *                   type: object
 */
router.put("/:id", 
    checkToken, 
    checkRole(['comu']), 
    affidaOrtoController.updateAffidaOrto
);

/**
 * @swagger
 * /api/v1/affidaOrti/{id}:
 *   delete:
 *     summary: Delete orto assignment by ID
 *     description: |
 *       Remove an existing orto assignment from the system (Revoke management).
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune users only**
 *       
 *       Solo il Comune può revocare la gestione degli orti assegnati alle associazioni.
 *     tags:
 *       - AffidaOrti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida orto to delete
 *         example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: AffidaOrto deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaOrto deleted successfully'
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
 *         description: Forbidden - Only Comune users can delete orto assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: AffidaOrto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaOrto not found'
 *       500:
 *         description: Internal server error while deleting affida orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting affida orto'
 *                 error:
 *                   type: object
 */
router.delete("/:id", 
    checkToken, 
    checkRole(['comu']), 
    affidaOrtoController.deleteAffidaOrto
);

module.exports = router;