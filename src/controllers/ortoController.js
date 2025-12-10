const Orto  = require('../model/orto');

exports.getAllOrtos = async (req, res) => {
    try {
        const ortos = await Orto.find();
        res.status(200).json(ortos);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ortos', error });
    }   
};

exports.createOrto = async (req, res) => {
    try {
        const newOrto = new Orto(req.body);
        console.log(req.body)
        const savedOrto = await newOrto.save();
        res.status(201).json(savedOrto);
    } catch (error) {
        res.status(500).json({ message: 'Error creating orto', error });
    }  
};

exports.getOrtoById = async (req, res) => {
    try {
        const orto = await Orto.findById(req.params.id);
        if (!orto) {
            return res.status(404).json({ message: 'Orto not found' });
        }
        res.status(200).json(orto);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orto', error });
    }   
};

exports.updateOrto = async (req, res) => {
    try {
        const updatedOrto = await Orto.findByIdAndUpdate(req.params.id, req.body, { new: true });    
        if (!updatedOrto) {
            return res.status(404).json({ message: 'Orto not found' });
        }  
        res.status(200).json(updatedOrto);
    } catch (error) {
        res.status(500).json({ message: 'Error updating orto', error });
    }
};

exports.deleteOrto = async (req, res) => {
    try {
        const deletedOrto = await Orto.findByIdAndDelete(req.params.id);

        //TO-DO: Verificare se ci sono utenti che possiedono questo orto prima di eliminarlo
        

        if (!deletedOrto) {
            return res.status(404).json({ message: 'Orto not found' });
        }
        res.status(200).json({ message: 'Orto deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting orto', error });
    }               
};