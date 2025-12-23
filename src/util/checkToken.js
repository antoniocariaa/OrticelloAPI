var jwt = require('jsonwebtoken');

const checkToken = function(req, res, next) {
    
    //Get the token from the standard Authorization header
    var authHeader = req.headers['authorization'];
    var token;

    // Check if Authorization header exists and starts with 'Bearer '
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // Remove 'Bearer ' and keep the token
    } else {
        // check URL parameters or custom header 'x-access-token'
        token = req.query.token || req.headers['x-access-token'];
    }

    // if there is no token
    if (!token) {
        return res.status(401).send({ 
            success: false,
            message: 'No token provided.'
        });
    }

    // decode token, verifies secret and checks exp
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {            
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Failed to authenticate token.'
            });     
        } else {
            // if everything is good, save to request for use in other routes
            req.loggedUser = decoded;
            next();
        }
    });
    
};

module.exports = checkToken;