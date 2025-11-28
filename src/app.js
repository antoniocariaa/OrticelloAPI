var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080




// Handling GET requests
app.get('/api/v1/orti', function(req, res){
	if(req.params.sensor)
		res.json()
	res.status(200).json({"name": "povo1", "association": {name: "Amici di Povo"}, "latitude": "1234", "longitude": "5678"});
    console.log('/api/v1/orti');
});

// Handling GET requests
app.get('/', function(req, res){
	res.send('Hello World!');
    console.log('Hello World!');
});

//
app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});