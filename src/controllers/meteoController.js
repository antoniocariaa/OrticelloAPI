const logger = require('../config/logger');
const sensor = require('../model/climate/meteo');

exports.getAllMeteo = async (req, res) => {
    try {
        logger.debug('Fetching all meteo data');
        const meteoData = await sensor.find();
        logger.db('SELECT', 'Meteo', true, { count: meteoData.length });
        res.status(200).json(meteoData);
    } catch (error) {
        logger.db('SELECT', 'Meteo', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_meteo'), error});
    }
};

exports.getMeteoById = async (req, res) => {
    try {
        logger.debug('Fetching meteo data by ID', { id: req.params.id });
        const meteoEntry = await sensor.findById(req.params.id);
        if (!meteoEntry) {
            logger.warn('Meteo data not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.meteo') });
        }
        logger.db('SELECT', 'Meteo', true, { id: req.params.id });
        res.status(200).json(meteoEntry);
    } catch (error) {
        logger.db('SELECT', 'Meteo', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_meteo'), error });
    }
};

// TO DO: Implement specific methods for meteo data retrieval based on date range and geographical location.