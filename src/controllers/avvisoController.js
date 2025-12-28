const Avviso = require('../model/news/avviso');
const logger = require('../config/logger');

exports.getAllAvvisi = async (req, res) => {
    try {
        const avvisi = await Avviso.find();
        res.status(200).json(avvisi);
    }
    catch (error) {
        logger.error('Error retrieving avvisi', { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_avvisi'), error });
    }
};

exports.createAvviso = async (req, res) => {
    try {
        const newAvviso = new Avviso(req.body);
        const savedAvviso = await newAvviso.save();
        logger.db('INSERT', 'Avviso', true, { id: savedAvviso._id });
        res.status(201).json({ data: savedAvviso, message: req.t('success.avviso_created') });
    } catch (error) {
        logger.error('Error creating avviso', { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_avviso'), error });
    }
};

exports.getAvvisoById = async (req, res) => {
    try {
        const avviso = await Avviso.findById(req.params.id);
        if (!avviso) {
            logger.warn('Avviso not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json(avviso);
    } catch (error) {
        logger.error('Error retrieving avviso by ID', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_avviso'), error });
    }
};

exports.updateAvviso = async (req, res) => {
    try {
        const updatedAvviso = await Avviso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAvviso) {
            logger.warn('Avviso not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json({ data: updatedAvviso, message: req.t('success.avviso_updated') });
    } catch (error) {
        logger.error('Error updating avviso', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_avviso'), error });
    }
};

exports.deleteAvviso = async (req, res) => {
    try {
        const deletedAvviso = await Avviso.findByIdAndDelete(req.params.id);
        if (!deletedAvviso) {
            logger.warn('Avviso not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json({ message: req.t('success.avviso_deleted') });
    } catch (error) {
        logger.error('Error deleting avviso', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_avviso'), error });
    }
}