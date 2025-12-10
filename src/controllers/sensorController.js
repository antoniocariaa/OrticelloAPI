const sensor = require('../model/climate/sensor');

exports.getAllSensors = async (req, res) => {
    try {
        const sensors = await sensor.find();
        res.status(200).json(sensors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving sensors', error });
    }
};

exports.getSensorById = async (req, res) => {
    try {
        const sensorEntry = await sensor.findById(req.params.id);
        if (!sensorEntry) {
            return res.status(404).json({ message: 'Sensor not found' });
        }
        res.status(200).json(sensorEntry);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sensor', error });
    }
};

// TO DO: Implement specific methods for sensor data retrieval based on date range and geographical location.   
