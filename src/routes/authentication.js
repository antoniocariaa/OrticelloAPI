var express = require('express');
var Utente = require('../model/utente');
var jwt = require('jsonwebtoken');

const router = express.Router();


router.post('', async function(req, res) {
    var user = {};

    if(req.body.googleToken){
        // Handle Google token authentication
        // TO DO LATER
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