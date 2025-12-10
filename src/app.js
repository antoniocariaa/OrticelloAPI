require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');

var ortoRoutes = require("./routes/ortoRoutes");
var lottoRoutes = require("./routes/lottoRoutes");
var utentiRoutes = require("./routes/utenteRoutes");
var associazioneRoutes = require("./routes/associazioneRoutes");
var comuneRoutes = require("./routes/comuneRoutes");
var affidaLottoRoutes = require("./routes/affidaLottoRoutes");
var affidaOrtoRoutes = require("./routes/affidaOrtoRoutes");

var app = express();
const PORT = process.env.PORT || 8080


mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/orti", ortoRoutes);
app.use("/api/v1/lotti", lottoRoutes);
app.use("/api/v1/utenti", utentiRoutes);
app.use("/api/v1/associazioni", associazioneRoutes);
app.use("/api/v1/comune", comuneRoutes);
app.use("/api/v1/affidaLotti", affidaLottoRoutes);
app.use("/api/v1/affidaOrti", affidaOrtoRoutes);


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