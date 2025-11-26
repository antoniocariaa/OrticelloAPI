var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080

// Handling GET requests
app.get('/', function(req, res){
	res.send('Hello World!');
});
//
app.listen(port, function() {
	console.log('Server running on port ', PORT);
});