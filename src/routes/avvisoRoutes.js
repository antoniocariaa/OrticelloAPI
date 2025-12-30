const express = require("express");
const router = express.Router();
const avvisoController = require("../controllers/avvisoController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

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
 * /api/v1/avvisi/filtered:
 *   get:
 *     summary: Get filtered notices with pagination
 *     description: Retrieve notices filtered by multiple criteria including entity type, date range, category, and read status. Supports pagination.
 *     tags:
 *       - Avvisi
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [asso, comu]
 *         description: Filter by entity type (association or municipality)
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *         description: Filter by specific entity ID (comune or associazione)
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: dataInizio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter notices from this date onwards (ISO format)
 *       - in: query
 *         name: dataFine
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter notices up to this date (ISO format)
 *       - in: query
 *         name: target
 *         schema:
 *           type: string
 *           enum: [asso, all]
 *         description: Filter by target audience (for municipality notices)
 *       - in: query
 *         name: letto
 *         schema:
 *           type: boolean
 *         description: Filter by read status (requires authentication)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered avvisi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Avviso'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *       500:
 *         description: Error retrieving filtered avvisi
 */
router.get("/filtered", avvisoController.getAvvisiFiltered);

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
router.post(
  "/",
  checkToken,
  checkRole(['comu', 'asso']),
  avvisoController.createAvviso
);

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
router.put(
  "/:id",
  checkToken,
  checkRole(['comu', 'asso']),
  avvisoController.updateAvviso
);

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
router.delete(
  "/:id",
  checkToken,
  checkRole(['comu', 'asso']),
  avvisoController.deleteAvviso
);

/**
 * @swagger
 * /api/v1/avvisi/{id}/read:
 *   put:
 *     summary: Mark notice as read
 *     description: Mark an avviso as read by the authenticated user. Creates or updates read status.
 *     tags:
 *       - Avvisi
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the avviso
 *     responses:
 *       200:
 *         description: Notice marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Notice marked as read'
 *                 data:
 *                   type: object
 *                   properties:
 *                     avvisoId:
 *                       type: string
 *                     dataLettura:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Avviso not found
 *       500:
 *         description: Error marking avviso as read
 */
router.put(
  "/:id/read",
  avvisoController.markAsRead
);

/**
 * @swagger
 * /api/v1/avvisi/read-status:
 *   post:
 *     summary: Get read status for multiple notices
 *     description: Get read status for multiple avvisi for the authenticated user
 *     tags:
 *       - Avvisi
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avvisiIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of avviso IDs to check
 *     responses:
 *       200:
 *         description: Read status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       letto:
 *                         type: boolean
 *                       dataLettura:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *       401:
 *         description: Authentication required
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error retrieving read status
 */
router.post(
  "/read-status",
  avvisoController.getReadStatus
);

module.exports = router;