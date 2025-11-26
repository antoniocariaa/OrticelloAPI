var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080

// Handling GET requests
app.get('/', function(req, res){
	res.send('Hello World!');
    console.log('Hello World!');
});
//
app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});