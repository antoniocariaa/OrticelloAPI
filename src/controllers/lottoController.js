const Lotto = require('../models/Lotto');

exports.getAllLotti = async (req, res) => {
    try {
        const lotti = await Lotto.find();
        res.status(200).json(lotti);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving lotti', error});
    }
};

exports.createLotto = async (req, res) => {
    try{
        const newLotto = new Lotto(req.body);
        const savedLotto = await newLotto.save();
        res.status(201).json(savedLotto);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lotto', error});
    }
};

exports.getLottoById = async (req, res) => {
    try {
        const lotto = await Lotto.findById(req.params.id);
        if(!lotto){
           return res.status(404).json({ message: 'Lotto not found' });
        }
        res.status(200).json(lotto);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving lotto', error});
    }
};

exports.updateLotto = async (req, res) => {
    try {
        const updatedLotto = await Lotto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!updatedLotto) {
            return res.status(404).json({ message: 'Lotto not found' });
        } 
        res.status(200).json(updatedLotto);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lotto', error });
    }
};

exports.deleteLotto = async (req, res) => {
    try {
        const deletedLotto = await Lotto.findByIdAndDelete(req.params.id);
        if(!deletedLotto){
            return res.status(404).json({ message: 'Lotto not found' });
        }
        res.status(200).json({ message: 'Lotto deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lotto', error });
    }
};