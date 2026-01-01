const express = require("express");
const router = express.Router();
const lottoController = require("../controllers/lottoController");
const checkToken = require('../util/checkToken');
const checkRole = require('../util/checkRole');

/**
 * @swagger
 * /api/v1/lotti:
 *   get:
 *     summary: Get list of lotti
 *     description: |
 *       Retrieve a list of all lotti (plots). Returns an array of lotto objects with their 
 *       complete details including dimensions, status, sensor information, and associated orto.
 *       
 *       **Access Control:**
 *       - Accessible to **all authenticated users** (Cittadini, Associazioni, Comune)
 *       
 *       **Business Rules:** RF6, RF24, RF17 - Tutti devono poter vedere i lotti
 *     tags:
 *       - Lotti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lotto'
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
 *         description: Internal server error while retrieving lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving lotti'
 *                 error:
 *                   type: object
 */
router.get("/", 
    checkToken, 
    lottoController.getAllLotti
);

/**
 * @swagger
 * /api/v1/lotti/{id}:
 *   get:
 *     summary: Get lotto by ID
 *     description: |
 *       Retrieve a single plot by its unique MongoDB ObjectId. Returns detailed information 
 *       about the specific lotto including its dimensions, location, status, sensors, and 
 *       associated orto.
 *       
 *       **Access Control:**
 *       - Accessible to all authenticated users
 *     tags:
 *       - Lotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lotto
 *         example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved lotto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lotto'
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
 *         description: Lotto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto not found'
 *       500:
 *         description: Internal server error while retrieving lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving lotto'
 *                 error:
 *                   type: object
 */
router.get("/:id", 
    checkToken, 
    lottoController.getLottoById
);

/**
 * @swagger
 * /api/v1/lotti:
 *   post:
 *     summary: Create a new lotto
 *     description: |
 *       Create a new plot configuration with detailed specifications including dimensions, 
 *       location coordinates, sensor assignments, and associated orto.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune users only**
 *       
 *       **Business Rules:** RF16/RF17 - Solo il Comune definisce la struttura degli orti e 
 *       aggiunge lotti
 *     tags:
 *       - Lotti
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lotto'
 *           example:
 *             numero: 'A1'
 *             superficie: 50
 *             orto: '507f1f77bcf86cd799439011'
 *             coordinate:
 *               lat: 46.4983
 *               lng: 11.3548
 *             sensori:
 *               - tipo: 'umidita'
 *                 id: 'SENS001'
 *               - tipo: 'temperatura'
 *                 id: 'SENS002'
 *             stato: 'disponibile'
 *     responses:
 *       201:
 *         description: Lotto created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lotto'
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
 *         description: Forbidden - Only Comune users can create lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden - Only Comune can create lotti'
 *       500:
 *         description: Internal server error while creating lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating lotto'
 *                 error:
 *                   type: object
 */
router.post("/", 
    checkToken, 
    checkRole(['comu']), 
    lottoController.createLotto
);

/**
 * @swagger
 * /api/v1/lotti/{id}:
 *   put:
 *     summary: Update lotto by ID
 *     description: |
 *       Update an existing plot information including dimensions, location coordinates, 
 *       sensor configurations, status, and other attributes.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune users only**
 *       
 *       Solo il Comune può modificare la configurazione dei lotti.
 *     tags:
 *       - Lotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lotto to update
 *         example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lotto'
 *           example:
 *             numero: 'A1'
 *             superficie: 55
 *             orto: '507f1f77bcf86cd799439011'
 *             coordinate:
 *               lat: 46.4983
 *               lng: 11.3548
 *             sensori:
 *               - tipo: 'umidita'
 *                 id: 'SENS001'
 *               - tipo: 'temperatura'
 *                 id: 'SENS002'
 *               - tipo: 'ph'
 *                 id: 'SENS003'
 *             stato: 'occupato'
 *     responses:
 *       200:
 *         description: Lotto updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lotto'
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
 *         description: Forbidden - Only Comune users can update lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: Lotto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto not found'
 *       500:
 *         description: Internal server error while updating lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating lotto'
 *                 error:
 *                   type: object
 */
router.put("/:id", 
    checkToken, 
    checkRole(['comu']), 
    lottoController.updateLotto
);

/**
 * @swagger
 * /api/v1/lotti/{id}:
 *   delete:
 *     summary: Delete lotto by ID
 *     description: |
 *       Delete a plot by its unique identifier. This operation permanently removes the lotto 
 *       from the system.
 *       
 *       **Access Control:**
 *       - **Strictly reserved for Comune users only**
 *       
 *       **Business Rule:** RF17.3 - Il Comune può rimuovere lotti
 *       
 *       **Warning:** This operation may affect related entities (assignments, sensor data, etc.). 
 *       Ensure the lotto is not currently assigned before deletion.
 *     tags:
 *       - Lotti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lotto to delete
 *         example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Lotto deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto deleted successfully'
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
 *         description: Forbidden - Only Comune users can delete lotti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden'
 *       404:
 *         description: Lotto not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lotto not found'
 *       500:
 *         description: Internal server error while deleting lotto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error deleting lotto'
 *                 error:
 *                   type: object
 */
router.delete("/:id", 
    checkToken, 
    checkRole(['comu']), 
    lottoController.deleteLotto
);

module.exports = router;