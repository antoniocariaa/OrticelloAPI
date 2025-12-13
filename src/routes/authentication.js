var express = require('express');
var Utente = require('../model/utente');
var jwt = require('jsonwebtoken');
var OAuth2Client = require('google-auth-library');

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
        const payload = await verify( req.body.googleToken ).catch(console.error);
		console.log(payload);

		user = await Utente.findOne({ email: payload['email'] }).exec();
		if ( ! user ) {
			user = new Utente({
				email: payload['email'],
				password: 'default-google-password-to-be-changed'
			});
			await user.save().exec();
			console.log('Utente created after login with google');
			
		}
    }else{
        console.log(req.body.email);
        user = await Utente.findOne({ email: req.body.email }).select('email password').exec();
        
        console.log(user);

        if(!user){
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        if(user.password !== req.body.password){
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }
    }

    var payload = {email: user.email, id: user._id};
    var options = {expiresIn: 86400}

    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.json({
        success:true,
        message: 'Token generated',
        token: token,
        email: user.email,
        id: user._id,
        self: "/api/v1/utenti/" + user._id
    });
});

module.exports = router;