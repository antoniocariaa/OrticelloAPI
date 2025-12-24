const bando = require('../model/news/bando');
const logger = require('../config/logger');

exports.getAllBandi = async (req, res) => {
    try {
        const bandi = await bando.find();
        res.status(200).json(bandi);
    }
    catch (error) {
        logger.error('Error retrieving bandi', { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_bandi'), error });
    }
};

exports.createBando = async (req, res) => {
    try {
        const newBando = new bando(req.body);
        const savedBando = await newBando.save();
        logger.db('INSERT', 'Bando', true, { id: savedBando._id });
        res.status(201).json({ data: savedBando, message: req.t('success.bando_created') });
    } catch (error) {
        logger.error('Error creating bando', { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_bando'), error });
    }
};

exports.getBandoById = async (req, res) => {
    try {
        const bando = await bando.findById(req.params.id);
        if (!bando) {
            logger.warn('Bando not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        res.status(200).json(bando);
    } catch (error) {
        logger.error('Error retrieving bando by ID', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_bando'), error });
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
            logger.warn('Bando not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        logger.db('UPDATE', 'Bando', true, { id: req.params.id });
        res.status(200).json({ data: updatedBando, message: req.t('success.bando_updated') });
    } catch (error) {
        logger.error('Error updating bando', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_bando'), error });
    }
};

exports.deleteBando = async (req, res) => {
    try {
        const deletedBando = await bando.findByIdAndDelete(req.params.id);
        if (!deletedBando) {
            logger.warn('Bando not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        logger.db('DELETE', 'Bando', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.bando_deleted') });
    } catch (error) {
        logger.error('Error deleting bando', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_bando'), error });
    }
};
