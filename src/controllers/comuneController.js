const Comune = require('../model/org/comune');
const logger = require('../config/logger');

exports.getAllComuni = async (req, res) => {
    try {
        const comuni = await Comune.find();
        res.status(200).json(comuni);
    } catch (error) {
        logger.error('Error retrieving comuni', { error: error.message });
        res.status(500).json({ 
            message: req.t('errors.retrieving_comuni'), 
            error: error.message 
        });
    }
};

exports.getComuneById = async (req, res) => {
    try {
        const comune = await Comune.findById(req.params.id);
        
        if (!comune) {
            logger.warn('Comune not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.comune') });
        }
        
        res.status(200).json(comune);
    } catch (error) {
        logger.error('Error retrieving comune by ID', { error: error.message, id: req.params.id });
        res.status(500).json({ 
            message: req.t('errors.retrieving_comune'), 
            error: error.message 
        });
    }
};

exports.createComune = async (req, res) => {
    try {
        const nuovoComune = new Comune(req.body);
        const comuneSalvato = await nuovoComune.save();
        
        logger.db('INSERT', 'Comune', true, { id: comuneSalvato._id });
        res.status(201).json({ data: comuneSalvato, message: req.t('success.comune_created') });
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            logger.db('INSERT', 'Comune', false, { error: error.message, data: req.body });
            return res.status(400).json({ 
                message: req.t('errors.invalid_duplicate_data'), 
                error: error.message 
            });
        }
        logger.error('Error creating comune', { error: error.message, data: req.body });
        res.status(500).json({ 
            message: req.t('errors.creating_comune'), 
            error: error.message 
        });
    }
};

exports.updateComune = async (req, res) => {
    try {
        const comuneAggiornato = await Comune.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true,           
                runValidators: true  
            }
        );

        if (!comuneAggiornato) {
            logger.warn('Comune not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.comune') });
        }

        logger.db('UPDATE', 'Comune', true, { id: req.params.id });
        res.status(200).json({ data: comuneAggiornato, message: req.t('success.comune_updated') });
    } catch (error) {
        if (error.name === 'ValidationError') {
            logger.db('UPDATE', 'Comune', false, { error: error.message, id: req.params.id });
            return res.status(400).json({ 
                message: req.t('errors.invalid_duplicate_data'), 
                error: error.message 
            });
        }

        logger.error('Error updating comune', { error: error.message, id: req.params.id });
        res.status(500).json({ 
            message: req.t('errors.updating_comune'), 
            error: error.message 
        });
    }
};

exports.deleteComune = async (req, res) => {
    try {
        const comuneEliminato = await Comune.findByIdAndDelete(req.params.id);

        if (!comuneEliminato) {
            logger.warn('Comune not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.comune') });
        }

        logger.db('DELETE', 'Comune', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.comune_deleted') });
    } catch (error) {

        logger.error('Error deleting comune', { error: error.message, id: req.params.id });
        res.status(500).json({ 
            message: req.t('errors.deleting_comune'), 
            error: error.message 
        });
    }
};