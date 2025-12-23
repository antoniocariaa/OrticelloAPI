const AffidaOrto = require('../model/affidaOrto');
const logger = require('../config/logger');

exports.getAllAffidaOrti = async (req, res) => {
    try {
        const affidamenti = await AffidaOrto.find()
            .populate("orto")
            .populate("associazione");

        res.status(200).json(affidamenti);
    } catch (error) {
        logger.error('Error retrieving affidamenti', { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_affidamenti_orto'), error });
    }
};

exports.createAffidaOrto = async (req, res) => {
    try {
        const newAffidamento = new AffidaOrto(req.body);
        const saved = await newAffidamento.save();

        logger.db('INSERT', 'AffidaOrto', true, { id: saved._id });
        res.status(201).json({ message: req.t('success.affidamento_orto_created'), data: saved });
    } catch (error) {
        logger.error('Error creating affidamento', { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_affidamento_orto'), error });
    }
};

exports.getAffidaOrtoById = async (req, res) => {
    try {
        const affidamento = await AffidaOrto.findById(req.params.id)
            .populate("orto")
            .populate("associazione");

        if (!affidamento) {
            logger.warn('Affidamento not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_orto') });
        }

        logger.db('SELECT', 'AffidaOrto', true, { id: req.params.id });
        res.status(200).json(affidamento);
    } catch (error) {
        logger.error('Error retrieving affidamento', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_affidamento_orto'), error });
    }
};

exports.updateAffidaOrto = async (req, res) => {
    try {
        const updated = await AffidaOrto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            logger.warn('Affidamento not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_orto') });
        }

        logger.db('UPDATE', 'AffidaOrto', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.affidamento_orto_updated'), data: updated });
    } catch (error) {
        logger.error('Error updating affidamento', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_affidamento_orto'), error });
    }
};

exports.deleteAffidaOrto = async (req, res) => {
    try {
        const deleted = await AffidaOrto.findByIdAndDelete(req.params.id);

        if (!deleted) {
            logger.warn('Affidamento not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_orto') });
        }

        logger.db('DELETE', 'AffidaOrto', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.affidamento_orto_deleted') });
    } catch (error) {

        logger.error('Error deleting affidamento', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_affidamento_orto'), error });
    }
};
