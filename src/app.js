require('dotenv').config({ debug: false });
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
var { initializeSwagger } = require('./config/swagger');
var swaggerUi = require('swagger-ui-express');
var { initializeSwagger } = require('./config/swagger');
var detectLanguage = require('./util/detectLanguage');

const logger = require('./config/logger');
const requestLogger = require('./util/requestLogger');
const errorLogger = require('./util/errorLogger');

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
var checkToken = require("./util/checkToken");

var app = express();
const PORT = process.env.PORT || 8080


mongoose.connect(process.env.MONGODB_URI, {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000
})
	.then(() => {
		logger.info('MongoDB connected successfully', { uri: process.env.MONGODB_URI?.split('@')[1] });
	})
	.catch((err) => {
		logger.error('MongoDB connection failed', { error: err.message });
	});

// Event listeners per MongoDB
mongoose.connection.on('error', (err) => {
	logger.error('MongoDB connection error', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
	logger.warn('MongoDB disconnected');
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware di logging delle richieste (prima dei routes)
app.use(requestLogger);

app.use(detectLanguage);

app.use('/api/v1/authentication', authentication);

// Handling GET requests
app.get('/', async function (req, res) {
	try {
		res.status(200).json("Orticello API is running");
	} catch (error) {
		res.status(500).json({ message: 'Error', error });
	}
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
const swaggerSpec = initializeSwagger();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: "Orticello API Documentation"
}));
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
	logger.warn('404 - Route not found', {
		method: req.method,
		url: req.originalUrl,
		ip: req.ip
	});
	res.status(404);
	res.json({ error: 'Page Not found Error 404' });
});

/* Middleware di logging errori */
app.use(errorLogger);

/* Default error handler */
app.use((err, req, res, next) => {
	res.status(500).json({ error: 'Internal Server Error 500!' });
});

// Export app for testing
module.exports = app;

// Avvio del server solo se non siamo in ambiente di test
if (require.main === module) {
	const server = app.listen(PORT, function () {
		logger.info(`Server started successfully`, { port: PORT, env: process.env.NODE_ENV || 'development' });
	});

	// Gestione errori del server
	server.on('error', (error) => {
		if (error.code === 'EADDRINUSE') {
			logger.error(`Port ${PORT} is already in use`, { port: PORT });
			process.exit(1);
		} else {
			logger.error(`Server error: ${error.message}`, { error: error.code });
			throw error;
		}
	});

	process.on('SIGTERM', () => {
		logger.info('SIGTERM received, closing server gracefully');
		server.close(() => {
			logger.info('Server closed');
			process.exit(0);
		});
	});

	process.on('SIGINT', () => {
		logger.info('SIGINT received, closing server gracefully');
		server.close(() => {
			logger.info('Server closed');
			process.exit(0);
		});
	});
}


