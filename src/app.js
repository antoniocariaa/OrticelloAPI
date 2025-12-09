require("dotenv").config();
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
const PORT = process.env.PORT || 8080


mongoose.connect(process.env.MONGODB_URI, {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000
});

// Handling GET requests
app.get('/api/v1/orti', function(req, res){
	if(req.params.sensor)
		res.json()
	res.status(200).json({"name": "povo1", "association": {name: "Amici di Povo"}, "latitude": "1234", "longitude": "5678"});
    console.log('/api/v1/orti');
});

mongoose.connect(process.env.MONGODB_URI, {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000
});


app.use("/api/orti", ortoRoutes);


// Handling GET requests
app.get('/', async function(req, res){
	res.send('Hello World!');
    console.log('Hello World!');
});

// Handling GET requests
app.get('/api/v1/orti', function(req, res){
	res.send([
  {
    "self": "self",
    "latitude": "1234",
    "longitude": "5678",
    "association": {
      "self": "self",
      "name": "amici di povo"
    }
  }
]);
    console.log('Amici di Povo');
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