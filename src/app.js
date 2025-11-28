require("dotenv").config();
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Orto = require('./model/orto');
const orto = require('./model/orto');


mongoose.connect(process.env.MONGODB_URI, {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000
});

const PORT = process.env.PORT || 8080




// Handling GET requests
app.get('/api/v1/orti', function(req, res){
	if(req.params.sensor)
		res.json()
	res.status(200).json({"name": "povo1", "association": {name: "Amici di Povo"}, "latitude": "1234", "longitude": "5678"});
    console.log('/api/v1/orti');
});

// Handling GET requests
app.get('/', async function(req, res){
	res.send('Hello World!');
	
	let newOrto = new Orto({
		nome: "OrtoTest",
		indirizzo: "Via di Test 123",
		coordinate: {
			lat: 41.90,
			lng: 12.49
		},
		lotti: []  // opzionale
	});

	await newOrto.save();



    console.log('Hello World!');
});



//
app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});