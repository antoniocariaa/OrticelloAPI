const Lotto = require('../model/lotto');
const logger = require('../config/logger');

exports.getAllLotti = async (req, res) => {
    try {
        logger.debug('Fetching all lotti');
        const lotti = await Lotto.find().select('-colture');
        logger.db('SELECT', 'Lotto', true, { count: lotti.length });
        res.status(200).json(lotti);
    } catch (error) {
        logger.db('SELECT', 'Lotto', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_lotti'), error});
    }
};

exports.createLotto = async (req, res) => {
    try{
        logger.debug('Creating new lotto', { data: req.body });
        const newLotto = new Lotto(req.body);
        const savedLotto = await newLotto.save();
        logger.db('INSERT', 'Lotto', true, { id: savedLotto._id, numero: savedLotto.numero });
        res.status(201).json(savedLotto);
    } catch (error) {
        logger.db('INSERT', 'Lotto', false, { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_lotto'), error});
    }
};

exports.getLottoById = async (req, res) => {
    try {
        logger.debug('Fetching lotto by ID', { id: req.params.id });
        const lotto = await Lotto.findById(req.params.id);
        if(!lotto){
            logger.warn('Lotto not found', { id: req.params.id });
           return res.status(404).json({ message: req.t('notFound.lotto') });
        }
        logger.db('SELECT', 'Lotto', true, { id: req.params.id });
        res.status(200).json(lotto);
    } catch (error) {
        logger.db('SELECT', 'Lotto', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_lotto'), error});
    }
};

exports.updateLotto = async (req, res) => {
    try {
        logger.debug('Updating lotto', { id: req.params.id, data: req.body });
        const updatedLotto = await Lotto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!updatedLotto) {
            logger.warn('Lotto not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.lotto') });
        } 
        logger.db('UPDATE', 'Lotto', true, { id: req.params.id, numero: updatedLotto.numero });
        res.status(200).json(updatedLotto);
    } catch (error) {
        logger.db('UPDATE', 'Lotto', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_lotto'), error });
    }
};

exports.deleteLotto = async (req, res) => {
    try {
        logger.debug('Deleting lotto', { id: req.params.id });
        const deletedLotto = await Lotto.findByIdAndDelete(req.params.id);
        if(!deletedLotto){
            logger.warn('Lotto not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.lotto') });
        }
        logger.db('DELETE', 'Lotto', true, { id: req.params.id, numero: deletedLotto.numero });
        res.status(200).json({ message: req.t('success.lotto_deleted') });
    } catch (error) {
        logger.db('DELETE', 'Lotto', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_lotto'), error });
    }
};