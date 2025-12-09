const Orto  = require('../models/Orto');

exports.getAllOrtos = async (req, res) => {
    try {
        const ortos = await Orto.find();
        res.status(200).json(ortos);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ortos', error });
    }   
};