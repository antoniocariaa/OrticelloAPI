var express = require('express');
var router = express.Router();
var bandoController = require('../controllers/bandoController');
var checkToken = require('../util/checkToken');
var checkRole = require('../util/checkRole');

/**
 * @swagger
 * /api/v1/bandi:
 *   get:
 *     summary: Get list of announcements
 *     description: Retrieve a list of all announcements. Use query param 'active=true' to filter only current ones.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bandi
 *     parameters:                 
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Se impostato a true, restituisce solo i bandi non scaduti (ordinati per scadenza).
 *     responses:
 *       200:
 *         description: Successfully retrieved list of bandi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bando'
 *       500:
 *         description: Error retrieving bandi
 */
// GET: Comune e Associazioni possono vedere i bandi (RF26)
router.get('/', checkToken, checkRole(['comu', 'asso']), bandoController.getAllBandi);

/**
 * @swagger
 * /api/v1/bandi/attivi:
 *   get:
 *     summary: Get active announcements
 *     description: Retrieve only bandi that have already started and not yet ended (data_inizio <= now <= data_fine). Results are sorted by end date.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bandi
 *     responses:
 *       200:
 *         description: Successfully retrieved list of active bandi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bando'
 *       500:
 *         description: Error retrieving active bandi
 */
// GET: Bandi attivi (già iniziati e non ancora terminati)
router.get('/attivi', checkToken, checkRole(['comu', 'asso']), bandoController.getBandiAttivi);

/**
 * @swagger
 * /api/v1/bandi:
 *   post:
 *     summary: Create a new announcement
 *     description: Create a new bando. Only accessible by Comune.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bandi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bando'
 *     responses:
 *       201:
 *         description: Bando created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bando'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Error creating bando
 */
// POST: SOLO il Comune può creare un bando (RF15)
router.post('/', checkToken, checkRole(['comu']), bandoController.createBando);

/**
 * @swagger
 * /api/v1/bandi/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     description: Retrieve a single bando by ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bandi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved bando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bando'
 *       404:
 *         description: Bando not found
 *       500:
 *         description: Error retrieving bando
 */
// GET BY ID
router.get('/:id', checkToken, checkRole(['comu', 'asso']), bandoController.getBandoById);

/**
 * @swagger
 * /api/v1/bandi/{id}:
 *   put:
 *     summary: Update announcement by ID
 *     description: Update an existing bando. Only accessible by Comune.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bandi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bando'
 *     responses:
 *       200:
 *         description: Bando updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bando'
 *       404:
 *         description: Bando not found
 *       500:
 *         description: Error updating bando
 */
// PUT: SOLO il Comune può modificare un bando
router.put('/:id', checkToken, checkRole(['comu']), bandoController.updateBando);

/**
 * @swagger
 * /api/v1/bandi/{id}:
 *   delete:
 *     summary: Delete announcement by ID
 *     description: Remove an existing bando. Only accessible by Comune.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bandi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bando deleted successfully
 *       404:
 *         description: Bando not found
 *       500:
 *         description: Error deleting bando
 */
// DELETE: SOLO il Comune può eliminare un bando (RF15)
router.delete('/:id', checkToken, checkRole(['comu']), bandoController.deleteBando);

module.exports = router;
