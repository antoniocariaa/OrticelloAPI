const express = require("express");
const router = express.Router();
const utenteController = require("../controllers/utenteController");
const checkToken = require("../util/checkToken");

/**
 * @swagger
 * /api/v1/utenti:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user in the system. Password is hashed before storage. No authentication required for this endpoint.
 *     tags:
 *       - Utenti
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cognome
 *               - codicefiscale
 *               - email
 *               - password
 *               - indirizzo
 *               - telefono
 *             properties:
 *               nome:
 *                 type: string
 *                 description: User's first name
 *                 example: Paolo
 *               cognome:
 *                 type: string
 *                 description: User's last name
 *                 example: Rossi
 *               codicefiscale:
 *                 type: string
 *                 description: Tax ID (validated for EU countries)
 *                 example: RSSMRA80A01H501U
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email (must be unique)
 *                 example: paolo.rossi@rossi.it
 *               password:
 *                 type: string
 *                 description: User's password (will be hashed)
 *                 example: securePassword123
 *               indirizzo:
 *                 type: string
 *                 description: User's address
 *                 example: Via Roma 10, Trento
 *               telefono:
 *                 type: string
 *                 description: Mobile phone number (validated)
 *                 example: +393331234567
 *               tipo:
 *                 type: string
 *                 enum: [citt, asso, comu]
 *                 description: User type (citt=citizen, asso=association, comu=municipality)
 *                 default: citt
 *                 example: citt
 *               associazione:
 *                 type: string
 *                 description: Associazione ObjectId (required if tipo=asso)
 *                 example: 507f1f77bcf86cd799439014
 *               comune:
 *                 type: string
 *                 description: Comune ObjectId (required if tipo=comu)
 *                 example: 507f1f77bcf86cd799439015
 *               admin:
 *                 type: boolean
 *                 description: Admin flag (required if tipo != citt)
 *                 default: false
 *                 example: false
 *           examples:
 *             citizen:
 *               summary: Create a citizen user
 *               value:
 *                 nome: Paolo
 *                 cognome: Rossi
 *                 codicefiscale: RSSMRA80A01H501U
 *                 email: paolo.rossi@rossi.it
 *                 password: securePassword123
 *                 indirizzo: Via Roma 10, Trento
 *                 telefono: +393331234567
 *                 tipo: citt
 *             association:
 *               summary: Create an association user
 *               value:
 *                 nome: Mario
 *                 cognome: Verdi
 *                 codicefiscale: VRDMRA75B15H501T
 *                 email: mario.verdi@ortitrento.it
 *                 password: securePassword123
 *                 indirizzo: Via delle Associazioni 45, Trento
 *                 telefono: +393331234568
 *                 tipo: asso
 *                 associazione: 507f1f77bcf86cd799439014
 *                 admin: true
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utente creato con successo
 *                 utente:
 *                   $ref: '#/components/schemas/Utente'
 *                 self:
 *                   type: string
 *                   description: Link to created user resource
 *                   example: /api/v1/utenti/693bfed09c0ff8cb58ab35fe
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Errore di validazione
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["PLRS12345678lmnn non è un codice fiscale valido per nessun paese dell'UE"]
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utente già esistente con questa email
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Errore nella creazione dell'utente
 *                 error:
 *                   type: string
 */
router.post("/", utenteController.createUtente);

router.use(checkToken);

/**
 * @swagger
 * /api/v1/utenti:
 *   get:
 *     summary: Get list of users
 *     description: Retrieve a list of all users (utenti). Returns an array of utente objects with their details including nome, cognome, email, tipo, and references to associazione or comune if applicable.
 *     tags:
 *       - Utenti
 *     responses:
 *       200:
 *         description: Successfully retrieved list of utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utente'
 *       500:
 *         description: Error retrieving utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving utenti'
 *                 error:
 *                   type: object
 */
router.get("/", utenteController.getAllUtenti);

/**
 * @swagger
 * /api/v1/utenti/comune:
 *   get:
 *     summary: Get list of users of the same comune
 *     description: Retrieve a list of all users (utenti) that belong to the same comune as the logged in user.
 *     tags:
 *       - Utenti
 *     responses:
 *       200:
 *         description: Successfully retrieved list of utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utente'
 *       500:
 *         description: Error retrieving utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving utenti'
 *                 error:
 *                   type: object
 */
router.get("/comune", utenteController.getComuneUtenti);

/**
 * @swagger
 * /api/v1/utenti/{id}:
 *   get:
 *     summary: Get utente by ID
 *     description: Retrieve a single user by its unique identifier
 *     tags:
 *       - Utenti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the utente
 *     responses:
 *       200:
 *         description: Successfully retrieved utente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utente'
 *       404:
 *         description: Utente not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utente not found'
 *       500:
 *         description: Error retrieving utente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving utente'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/v1/utenti/{id}:
 *   get:
 *     summary: Get utente by ID
 *     description: Retrieve a single user by its unique identifier
 *     tags:
 *       - Utenti
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the utente
 *     responses:
 *       200:
 *         description: Successfully retrieved utente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utente'
 *       404:
 *         description: Utente not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utente not found'
 *       500:
 *         description: Error retrieving utente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving utente'
 *                 error:
 *                   type: object
 */
router.get("/associazione", utenteController.getAssociazioneUtenti);
router.get("/:id", utenteController.getUtenteById);

router.put("/updatePassword/:id", utenteController.updatePassword);
router.put("/removeComuneRole/:id", utenteController.removeComuneRole);
router.put("/addComuneMember", utenteController.addComuneMember);

router.put("/removeAssociazioneRole/:id", utenteController.removeAssociazioneRole);
router.put("/addAssociazioneMember", utenteController.addAssociazioneMember);

router.put("/:id", utenteController.updateUtente);
router.delete("/:id", utenteController.deleteUtente);

module.exports = router;