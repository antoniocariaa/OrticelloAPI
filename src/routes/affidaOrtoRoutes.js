const express = require("express");
const router = express.Router();
const affidaOrtoController = require("../controllers/affidaOrtoController");

/**
 * @swagger
 * /api/v1/affidaOrti:
 *   get:
 *     summary: Get list of orto assignments
 *     description: Retrieve a list of all orto assignments (affidaOrti). Returns an array showing which associazioni have been assigned to which orti, including assignment start and end dates.
 *     tags:
 *       - AffidaOrti
 *     responses:
 *       200:
 *         description: Successfully retrieved list of affida orti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaOrto'
 *       500:
 *         description: Error retrieving affida orti
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
router.get("/", affidaOrtoController.getAllAffidaOrti);

/**
 * @swagger
 * /api/v1/affidaOrti/{id}:
 *   get:
 *     summary: Get orto assignment by ID
 *     description: Retrieve a single orto assignment by its unique identifier
 *     tags:
 *       - AffidaOrti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida orto
 *     responses:
 *       200:
 *         description: Successfully retrieved affida orto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaOrto'
 *       404:
 *         description: AffidaOrto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaOrto not found'
 *       500:
 *         description: Error retrieving affida orto
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
router.get("/:id", affidaOrtoController.getAffidaOrtoById);

/**
 * @swagger
 * /api/v1/affidaOrti/active:
 *   get:
 *     summary: Get list of active orto assignments
 *     description: Retrieve a list of orto assignments that are currently active (where today's date falls within the assignment date range). Returns an array showing which associazioni are currently assigned to which orti.
 *     tags:
 *       - AffidaOrti
 *     responses:
 *       200:
 *         description: Successfully retrieved list of active affida orti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AffidaOrto'
 *       500:
 *         description: Error retrieving active affida orti
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
router.get("/active", affidaOrtoController.getActiveAffidaOrti);

/**
 * @swagger
 * /api/v1/affidaOrti:
 *   post:
 *     summary: Create a new orto assignment
 *     description: Create a new assignment of an orto to an associazione with start and end dates
 *     tags:
 *       - AffidaOrti
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AffidaOrto'
 *     responses:
 *       201:
 *         description: AffidaOrto created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaOrto'
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
 *         description: Error creating affida orto
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
router.post("/", affidaOrtoController.createAffidaOrto);

/**
 * @swagger
 * /api/v1/affidaOrti/{id}:
 *   put:
 *     summary: Update orto assignment by ID
 *     description: Update an existing orto assignment with new information (dates, orto, associazione)
 *     tags:
 *       - AffidaOrti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida orto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AffidaOrto'
 *     responses:
 *       200:
 *         description: AffidaOrto updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffidaOrto'
 *       404:
 *         description: AffidaOrto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaOrto not found'
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
 *         description: Error updating affida orto
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
router.put("/:id", affidaOrtoController.updateAffidaOrto);

/**
 * @swagger
 * /api/v1/affidaOrti/{id}:
 *   delete:
 *     summary: Delete orto assignment by ID
 *     description: Remove an existing orto assignment from the system
 *     tags:
 *       - AffidaOrti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the affida orto
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
 *       404:
 *         description: AffidaOrto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'AffidaOrto not found'
 *       500:
 *         description: Error deleting affida orto
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
router.delete("/:id", affidaOrtoController.deleteAffidaOrto);

module.exports = router;
