const express = require("express");
const router = express.Router();
const ortoController = require("../controllers/ortoController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

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
 * /api/v1/orti/search:
 *   get:
 *     summary: Search green gardens with filters
 *     description: Search for orti based on geographic location, plot size, and sensor availability
 *     tags:
 *       - Orti
 *     parameters:
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude for geographic search (requires latitude and radius)
 *         example: 11.3426
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude for geographic search (requires longitude and radius)
 *         example: 44.4949
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           format: float
 *         description: Search radius in meters from the given coordinates
 *         example: 5000
 *       - in: query
 *         name: minSize
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum plot size (dimensione) in square meters
 *         example: 50
 *       - in: query
 *         name: maxSize
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum plot size (dimensione) in square meters
 *         example: 200
 *       - in: query
 *         name: hasSensors
 *         schema:
 *           type: boolean
 *         description: Filter orti that have plots with sensors
 *         example: true
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered orti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of orti found
 *                 filters:
 *                   type: object
 *                   description: Applied filters
 *                   properties:
 *                     longitude:
 *                       type: number
 *                     latitude:
 *                       type: number
 *                     radius:
 *                       type: number
 *                     minSize:
 *                       type: number
 *                     maxSize:
 *                       type: number
 *                     hasSensors:
 *                       type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       indirizzo:
 *                         type: string
 *                       geometry:
 *                         type: object
 *                       lotti:
 *                         type: array
 *                       distance:
 *                         type: number
 *                         description: Distance in meters (only if geographic search is used)
 *                       lottiCount:
 *                         type: integer
 *                         description: Total number of plots
 *                       matchingLottiCount:
 *                         type: integer
 *                         description: Number of plots matching the filter criteria
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid coordinates'
 *       500:
 *         description: Error searching orti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error searching ortos'
 *                 error:
 *                   type: object
 */
router.get("/search", ortoController.searchOrtos);

/**
 * @swagger
 * /api/v1/orti:
 *   post:
 *     summary: Create a new orto
 *     description: Create a new green garden with the provided information. Only accessible by municipality users.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only municipality users can create orti
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
router.post("/", checkToken, checkRole(['comu']), ortoController.createOrto);

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
 *     description: Update an existing green garden with new information. Only accessible by municipality users.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only municipality users can update orti
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
router.put("/:id", checkToken, checkRole(['comu']), ortoController.updateOrto);

/**
 * @swagger
 * /api/v1/orti/{id}:
 *   delete:
 *     summary: Delete orto by ID
 *     description: Delete a green garden by its unique identifier. Only accessible by municipality users.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only municipality users can delete orti
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
router.delete("/:id", checkToken, checkRole(['comu']), ortoController.deleteOrto);


module.exports = router;