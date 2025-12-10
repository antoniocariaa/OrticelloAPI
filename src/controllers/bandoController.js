const bando = require('../model/news/bando');

exports.getAllBandi = async (req, res) => {
    try {
        const bandi = await bando.find();
        res.status(200).json(bandi);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving bandi', error });
    }
};

exports.createBando = async (req, res) => {
    try {
        const newBando = new bando(req.body);
        const savedBando = await newBando.save();
        res.status(201).json(savedBando);
    } catch (error) {
        res.status(500).json({ message: 'Error creating bando', error });
    }
};

exports.getBandoById = async (req, res) => {
    try {
        const bando = await bando.findById(req.params.id);
        if (!bando) {
            return res.status(404).json({ message: 'Bando not found' });
        }
        res.status(200).json(bando);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bando', error });
    }
};

exports.updateBando = async (req, res) => {
    try {
        const updatedBando = await bando.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedBando) {
            return res.status(404).json({ message: 'Bando not found' });
        }
        res.status(200).json(updatedBando);
    } catch (error) {
        res.status(500).json({ message: 'Error updating bando', error });
    }
};

exports.deleteBando = async (req, res) => {
    try {
        const deletedBando = await bando.findByIdAndDelete(req.params.id);
        if (!deletedBando) {
            return res.status(404).json({ message: 'Bando not found' });
        }
        res.status(200).json({ message: 'Bando deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bando', error });
    }
};
