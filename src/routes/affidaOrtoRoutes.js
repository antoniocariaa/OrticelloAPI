const express = require("express");
const router = express.Router();
const affidaOrtoController = require("../controllers/affidaOrtoController");


/**
 * @swagger
 * /api/v1/affida-orti/active:
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
 * /api/v1/affida-orti:
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
router.post("/", affidaOrtoController.createAffidaOrto);
router.get("/:id", affidaOrtoController.getAffidaOrtoById);
router.put("/:id", affidaOrtoController.updateAffidaOrto);
router.delete("/:id", affidaOrtoController.deleteAffidaOrto);

module.exports = router;
