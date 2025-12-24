const express = require("express");
const router = express.Router();
const ortoController = require("../controllers/ortoController");

/**
 * @swagger
 * /api/v1/orti:
 *   get:
 *     summary: Get list of green gardens
 *     description: Retrieve a list of all green gardens (orti). Returns an array of orto objects with their details.
 *     tags:
 *       - Orti
 *     responses:
 *       200:
 *         description: Successfully retrieved list of orti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orto'
 *       500:
 *         description: Error retrieving orti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving ortos'
 *                 error:
 *                   type: object
 */
router.get("/", ortoController.getAllOrtos);

/**
 * @swagger
 * /api/v1/orti:
 *   post:
 *     summary: Create a new orto
 *     description: Create a new green garden with the provided information
 *     tags:
 *       - Orti
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orto'
 *     responses:
 *       201:
 *         description: Orto created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orto'
 *       500:
 *         description: Error creating orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating orto'
 *                 error:
 *                   type: object
 */
router.post("/", ortoController.createOrto);

/**
 * @swagger
 * /api/v1/orti/{id}:
 *   get:
 *     summary: Get orto by ID
 *     description: Retrieve a single green garden by its unique identifier
 *     tags:
 *       - Orti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the orto
 *     responses:
 *       200:
 *         description: Successfully retrieved orto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orto'
 *       404:
 *         description: Orto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Orto not found'
 *       500:
 *         description: Error retrieving orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving orto'
 *                 error:
 *                   type: object
 */
router.get("/:id", ortoController.getOrtoById);

/**
 * @swagger
 * /api/v1/orti/{id}:
 *   put:
 *     summary: Update orto by ID
 *     description: Update an existing green garden with new information
 *     tags:
 *       - Orti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the orto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orto'
 *     responses:
 *       200:
 *         description: Orto updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orto'
 *       404:
 *         description: Orto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Orto not found'
 *       500:
 *         description: Error updating orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating orto'
 *                 error:
 *                   type: object
 */
router.put("/:id", ortoController.updateOrto);

/**
 * @swagger
 * /api/v1/orti/{id}:
 *   delete:
 *     summary: Delete orto by ID
 *     description: Delete a green garden by its unique identifier
 *     tags:
 *       - Orti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the orto
 *     responses:
 *       200:
 *         description: Orto deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Orto deleted successfully'
 *       404:
 *         description: Orto not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Orto not found'
 *       500:
 *         description: Error deleting orto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting orto'
 *                 error:
 *                   type: object
 */
router.delete("/:id", ortoController.deleteOrto);


module.exports = router;