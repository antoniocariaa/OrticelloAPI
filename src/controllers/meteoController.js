const sensor = require('../model/climate/meteo');

exports.getAllMeteo = async (req, res) => {
    try {
        const meteoData = await sensor.find();
        res.status(200).json(meteoData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving meteo data', error});
    }
};

exports.getMeteoById = async (req, res) => {
    try {
        const meteoEntry = await sensor.findById(req.params.id);
        if (!meteoEntry) {
            return res.status(404).json({ message: 'Meteo entry not found' });
        }
        res.status(200).json(meteoEntry);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving meteo entry', error });
    }
};

// TO DO: Implement specific methods for meteo data retrieval based on date range and geographical location.