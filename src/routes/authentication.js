var express = require('express');
var Utente = require('../model/utente');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const logger = require('../config/logger');

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client( GOOGLE_CLIENT_ID );

async function verify( token ) {
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


router.post('', async function(req, res) {
    var user = {};

    if(req.body.googleToken){
        try {
            logger.debug('Google authentication attempt');
            const payload = await verify( req.body.googleToken );
            logger.debug('Google token verified', { email: payload['email'] });

            user = await Utente.findOne({ email: payload['email'] }).exec();
            if ( ! user ) {
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
    }else{
        logger.debug('Email/password authentication attempt', { email: req.body.email });
        user = await Utente.findOne({ email: req.body.email }).select('email password').exec();
        
        if(!user){
            logger.auth('LOGIN', req.body.email, false, { reason: 'User not found' });
            return res.status(401).json({ message: req.t('auth.invalid_credentials') });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordValid){
            logger.auth('LOGIN', req.body.email, false, { reason: 'Wrong password', userId: user._id });
            return res.status(401).json({ message: req.t('auth.invalid_credentials') });
        }
        
        logger.auth('LOGIN', user.email, true, { userId: user._id });
    }

    var payload = {email: user.email, id: user._id};
    var options = {expiresIn: 86400}

    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    logger.info('JWT token generated', { userId: user._id, email: user.email });

    res.json({
        success:true,
        message: req.t('auth.login_success'),
        token: token,
        email: user.email,
        id: user._id,
        self: "/api/v1/utenti/" + user._id
    });
});

module.exports = router;