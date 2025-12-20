const Associazione = require('../model/org/associazione');
const logger = require('../config/logger');

exports.getAllAssociazioni = async (req, res) => {
    try {
        const associazioni = await Associazione.find();
        res.status(200).json(associazioni);
    } catch (error) {
        logger.error('Error retrieving associazioni', { error: error.message });
        res.status(500).json({ 
            message: req.t('errors.retrieving_associazioni'), 
            error: error.message 
        });
    }
};

exports.getAssociazioneById = async (req, res) => {
    try {
        const associazione = await Associazione.findById(req.params.id);
        
        if (!associazione) {
            logger.warn('Associazione not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }
        
        res.status(200).json(associazione);
    } catch (error) {
        logger.error('Error retrieving associazione by ID', { error: error.message, id: req.params.id });
        res.status(500).json({ 
            message: req.t('errors.retrieving_associazione'), 
            error: error.message 
        });
    }
};

exports.createAssociazione = async (req, res) => {
    try {
        const nuovaAssociazione = new Associazione(req.body);
        const associazioneSalvata = await nuovaAssociazione.save();

        logger.db('INSERT', 'Associazione', true, { id: associazioneSalvata._id });
        res.status(201).json({ data: associazioneSalvata, message: req.t('success.associazione_created') });
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            logger.db('INSERT', 'Associazione', false, { error: error.message, data: req.body });
            return res.status(400).json({ 
                message: req.t('validation.invalid_duplicate_data'), 
                error: error.message 
            });
        }
        logger.error('Error creating associazione', { error: error.message, data: req.body });
        res.status(500).json({ 
            message: req.t('errors.creating_associazione'), 
            error: error.message 
        });
    }
};

exports.updateAssociazione = async (req, res) => {
    try {
        const associazioneAggiornata = await Associazione.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true,           
                runValidators: true 
            }
        );

        if (!associazioneAggiornata) {
            logger.warn('Associazione not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        res.status(200).json({ data: associazioneAggiornata, message: req.t('success.associazione_updated') });
    } catch (error) {
        if (error.name === 'ValidationError') {
            logger.db('UPDATE', 'Associazione', false, { error: error.message, id: req.params.id });
            return res.status(400).json({ 
                message: req.t('validation.invalid_duplicate_data'), 
                error: error.message 
            });
        }
        logger.error('Error updating associazione', { error: error.message, id: req.params.id });
        res.status(500).json({ 
            message: req.t('errors.updating_associazione'), 
            error: error.message 
        });
    }
};

exports.deleteAssociazione = async (req, res) => {
    try {
        const associazioneEliminata = await Associazione.findByIdAndDelete(req.params.id);

        if (!associazioneEliminata) {
            logger.warn('Associazione not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        logger.db('DELETE', 'Associazione', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.associazione_deleted') });
    } catch (error) {
        logger.error('Error deleting associazione', { error: error.message, id: req.params.id });
        res.status(500).json({ 
            message: req.t('errors.deleting_associazione'), 
            error: error.message 
        });
    }
};