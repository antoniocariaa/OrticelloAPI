var express = require('express');
var Utente = require('../model/user/utente');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const logger = require('../config/logger');

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        // audience: GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];
    return payload;
}

/**
 * @swagger
 * /api/v1/authentication:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     description: Authenticate a user with email and password or Google token. Returns a JWT token valid for 24 hours.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (required if not using googleToken)
 *                 example: paolo.rossi@rossi.it
 *               password:
 *                 type: string
 *                 description: User's password (required if not using googleToken)
 *                 example: 12345678
 *               googleToken:
 *                 type: string
 *                 description: Google authentication token (alternative to email/password)
 *           examples:
 *             emailPassword:
 *               summary: Login with email and password
 *               value:
 *                 email: paolo.rossi@rossi.it
 *                 password: 12345678
 *             googleAuth:
 *               summary: Login with Google token
 *               value:
 *                 googleToken: eyJhbGciOiJSUzI1NiIsImtpZCI6...
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token generated
 *                 token:
 *                   type: string
 *                   description: JWT token (expires in 24 hours)
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 email:
 *                   type: string
 *                   example: paolo.rossi@rossi.it
 *                 id:
 *                   type: string
 *                   description: User's MongoDB ObjectId
 *                   example: 693bfed09c0ff8cb58ab35fe
 *                 self:
 *                   type: string
 *                   description: Link to user resource
 *                   example: /api/v1/utenti/693bfed09c0ff8cb58ab35fe
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               userNotFound:
 *                 value:
 *                   message: Authentication failed. User not found.
 *               wrongPassword:
 *                 value:
 *                   message: Authentication failed. Wrong password.
 */

router.post('', async function (req, res) {
    var user = {};

    if (req.body.googleToken) {
        try {
            logger.debug('Google authentication attempt');
            const payload = await verify(req.body.googleToken);
            logger.debug('Google token verified', { email: payload['email'] });

            user = await Utente.findOne({ email: payload['email'] }).exec();
            if (!user) {
                logger.info('Creating new user from Google login', { email: payload['email'] });
                user = new Utente({
                    nome: payload['given_name'],
                    cognome: payload['family_name'],
                    codicefiscale: 'NNNNNNNNNNNNNNNN',
                    email: payload['email'],
                    password: await bcrypt.hash('default-google-password-to-be-changed', 10),
                    indirizzo: 'Non specificato',
                    telefono: '+393000000000',
                    tipo: 'citt'
                });

                await user.save();
                logger.auth('GOOGLE_REGISTER', user.email, true, { userId: user._id });
            } else {
                logger.auth('GOOGLE_LOGIN', user.email, true, { userId: user._id });
            }
        } catch (error) {
            logger.auth('GOOGLE_LOGIN', 'unknown', false, { error: error.message });
            return res.status(401).json({ message: req.t('auth.google_failed') });
        }
    } else {
        logger.debug('Email/password authentication attempt', { email: req.body.email });
        user = await Utente.findOne({ email: req.body.email }).select('email password tipo admin').exec();

        if (!user) {
            logger.auth('LOGIN', req.body.email, false, { reason: 'User not found' });
            return res.status(401).json({ message: req.t('auth.invalid_credentials') });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            logger.auth('LOGIN', req.body.email, false, { reason: 'Wrong password', userId: user._id });
            return res.status(401).json({ message: req.t('auth.invalid_credentials') });
        }

        logger.auth('LOGIN', user.email, true, { userId: user._id });
    }

    var payload = {
        email: user.email,
        id: user._id,
        tipo: user.tipo,
        admin: user.admin
    };
    var options = { expiresIn: 86400 }

    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    logger.info('JWT token generated', { userId: user._id, email: user.email });

    res.json({
        success: true,
        message: req.t('auth.login_success'),
        token: token,
        email: user.email,
        id: user._id,
        self: "/api/v1/utenti/" + user._id
    });
});

module.exports = router;