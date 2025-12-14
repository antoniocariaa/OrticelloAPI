require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');

var ortoRoutes = require("./routes/ortoRoutes");
var lottoRoutes = require("./routes/lottoRoutes");
var utentiRoutes = require("./routes/utenteRoutes");
var associazioneRoutes = require("./routes/associazioneRoutes");
var comuneRoutes = require("./routes/comuneRoutes");
var affidaLottoRoutes = require("./routes/affidaLottoRoutes");
var affidaOrtoRoutes = require("./routes/affidaOrtoRoutes");
var avvisoRoutes = require("./routes/avvisoRoutes");
var bandoRoutes = require("./routes/bandoRoutes");
var meteoRoutes = require("./routes/meteoRoutes");
var sensorRoutes = require("./routes/sensorRoutes");
var authentication = require("./routes/authentication");
var checkToken = require("./model/checkToken");

var app = express();
const PORT = process.env.PORT || 8080


mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/authentication', authentication);

// Handling GET requests
app.get('/', async function(req, res){
	try{
    res.status(200).json("Orticello API is running");
  } catch(error){
    res.status(500).json({ message: 'Error', error });
  }
});

app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});

app.use("/api/v1/orti", checkToken);
app.use("/api/v1/lotti", checkToken);
app.use("/api/v1/associazioni", checkToken);
app.use("/api/v1/comune", checkToken);
app.use("/api/v1/affidaLotti", checkToken);
app.use("/api/v1/affidaOrti", checkToken);
app.use("/api/v1/avvisi", checkToken);
app.use("/api/v1/bandi", checkToken);
app.use("/api/v1/meteo", checkToken);
app.use("/api/v1/sensor", checkToken);

app.use("/api/v1/orti", ortoRoutes);
app.use("/api/v1/lotti", lottoRoutes);
//middleware di autenticazione separato per la creazione utenti (vedi utenteRoutes.js)
app.use("/api/v1/utenti", utentiRoutes);
app.use("/api/v1/associazioni", associazioneRoutes);
app.use("/api/v1/comune", comuneRoutes);
app.use("/api/v1/affidaLotti", affidaLottoRoutes);
app.use("/api/v1/affidaOrti", affidaOrtoRoutes);
app.use("/api/v1/avvisi", avvisoRoutes);
app.use("/api/v1/bandi", bandoRoutes);
app.use("/api/v1/meteo", meteoRoutes);
app.use("/api/v1/sensor", sensorRoutes);

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



