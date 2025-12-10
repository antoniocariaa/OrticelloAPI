const avviso = require('../model/news/avviso');

exports.getAllAvvisi = async (req, res) => {
    try {
        const avvisi = await avviso.find();
        res.status(200).json(avvisi);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving avvisi', error });
    }
};

exports.createAvviso = async (req, res) => {
    try {
        const newAvviso = new avviso(req.body);
        const savedAvviso = await newAvviso.save();
        res.status(201).json(savedAvviso);
    } catch (error) {
        res.status(500).json({ message: 'Error creating avviso', error });
    }
};

exports.getAvvisoById = async (req, res) => {
    try {
        const avviso = await avviso.findById(req.params.id);
        if (!avviso) {
            return res.status(404).json({ message: 'Avviso not found' });
        }
        res.status(200).json(avviso);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving avviso', error });
    }
};

exports.updateAvviso = async (req, res) => {
    try {
        const updatedAvviso = await avviso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAvviso) {
            return res.status(404).json({ message: 'Avviso not found' });
        }
        res.status(200).json(updatedAvviso);
    } catch (error) {
        res.status(500).json({ message: 'Error updating avviso', error });
    }
};

exports.deleteAvviso = async (req, res) => {
    try {
        const deletedAvviso = await avviso.findByIdAndDelete(req.params.id);
        if (!deletedAvviso) {
            return res.status(404).json({ message: 'Avviso not found' });
        }
        res.status(200).json({ message: 'Avviso deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting avviso', error });
    }
}