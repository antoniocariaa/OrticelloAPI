const logger = require('../config/logger');
const sensor = require('../model/climate/sensor');

exports.getAllSensors = async (req, res) => {
    try {
        logger.debug('Fetching all sensors');
        const sensors = await sensor.find();
        logger.db('SELECT', 'Sensor', true, { count: sensors.length });
        res.status(200).json(sensors);
    }
    catch (error) {
        logger.db('SELECT', 'Sensor', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_sensors'), error });
    }
};

exports.getSensorById = async (req, res) => {
    try {
        logger.debug('Fetching sensor by ID', { id: req.params.id });
        const sensorEntry = await sensor.findById(req.params.id);
        if (!sensorEntry) {
            logger.warn('Sensor not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.sensor') });
        }
        logger.db('SELECT', 'Sensor', true, { id: req.params.id });
        res.status(200).json(sensorEntry);
    } catch (error) {
        logger.db('SELECT', 'Sensor', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_sensor'), error });
    }
};

// TO DO: Implement specific methods for sensor data retrieval based on date range and geographical location.   
