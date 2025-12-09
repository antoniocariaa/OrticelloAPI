require('dotenv').config();
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
const PORT = process.env.PORT || 8080


app.use("/api/orti", ortoRoutes);


// Handling GET requests
app.get('/', async function(req, res){
	res.send('Hello World!');
	
});


app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});


/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Page Not found Error 404' });
});


/* Default error handler */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error 500!' });
});