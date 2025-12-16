const Lotto = require('../model/lotto');

exports.getAllLotti = async (req, res) => {
    try {
        const lotti = await Lotto.find();
        res.status(200).json(lotti);
    } catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_lotti'), error});
    }
};

exports.createLotto = async (req, res) => {
    try{
        const newLotto = new Lotto(req.body);
        const savedLotto = await newLotto.save();
        res.status(201).json(savedLotto);
    } catch (error) {
        res.status(500).json({ message: req.t('errors.creating_lotto'), error});
    }
};

exports.getLottoById = async (req, res) => {
    try {
        const lotto = await Lotto.findById(req.params.id);
        if(!lotto){
           return res.status(404).json({ message: req.t('notFound.lotto') });
        }
        res.status(200).json(lotto);
    } catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_lotto'), error});
    }
};

exports.updateLotto = async (req, res) => {
    try {
        const updatedLotto = await Lotto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!updatedLotto) {
            return res.status(404).json({ message: req.t('notFound.lotto') });
        } 
        res.status(200).json(updatedLotto);
    } catch (error) {
        res.status(500).json({ message: req.t('errors.updating_lotto'), error });
    }
};

exports.deleteLotto = async (req, res) => {
    try {
        const deletedLotto = await Lotto.findByIdAndDelete(req.params.id);
        if(!deletedLotto){
            return res.status(404).json({ message: req.t('notFound.lotto') });
        }
        res.status(200).json({ message: req.t('success.lotto_deleted') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.deleting_lotto'), error });
    }
};