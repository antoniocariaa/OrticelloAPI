const AffidaLotto = require('../model/affidaLotto');
const logger = require('../config/logger');

exports.getAllAffidaLotti = async (req, res) => {
    try {
        const affidamenti = await AffidaLotto.find()
            .populate("lotto")
            .populate("utente");
        res.status(200).json(affidamenti);
    } catch (error) {
        logger.error('Error retrieving affidamenti', { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_affidamenti_lotto'), error});
    }
};

exports.createAffidaLotto = async (req, res) => {
    try {
        const newAffidamento = new AffidaLotto(req.body);
        const saved = await newAffidamento.save();

        logger.db('INSERT', 'AffidaLotto', true, { id: saved._id });
        res.status(201).json({ message: req.t('success.affidamento_lotto_created'), data: saved });
    } catch (error) {
        logger.error('Error creating affidamento', { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_affidamento_lotto'), error });
    }
};

exports.getAffidaLottoById = async (req, res) => {
    try {
        const affidamento = await AffidaLotto.findById(req.params.id)
            .populate("lotto")
            .populate("utente");
        if (!affidamento) {
            logger.warn('Affidamento not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_lotto') });
        }
        logger.db('SELECT', 'AffidaLotto', true, { id: req.params.id });
        res.status(200).json(affidamento);
    } catch (error) {
        logger.error('Error retrieving affidamento', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_affidamento_lotto'), error });
    }
};

exports.updateAffidaLotto = async (req, res) => {
    try {
        const updated = await AffidaLotto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) {
            logger.warn('Affidamento not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_lotto') });
        }
        logger.db('UPDATE', 'AffidaLotto', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.affidamento_lotto_updated'), data: updated });
    } catch (error) {
        logger.error('Error updating affidamento', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_affidamento_lotto'), error });
    }
};

exports.deleteAffidaLotto = async (req, res) => {
    try {
        const deleted = await AffidaLotto.findByIdAndDelete(req.params.id);
        if (!deleted) {
            logger.warn('Affidamento not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_lotto') });
        }
        logger.db('DELETE', 'AffidaLotto', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.affidamento_lotto_deleted') });
    } catch (error) {
        logger.error('Error deleting affidamento', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_affidamento_lotto'), error });
    }
};

exports.addColtura = async (req, res) => {
    const { coltura } = req.body;  

    if (!coltura) {
        logger.warn('coltura is required to add', { id: req.params.id });
        return res.status(400).json({ message: req.t('validation.coltura_required') });
    }

    try {
        const affida = await AffidaLotto.findById(req.params.id);
        if (!affida) {
            logger.warn('Affidamento not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_lotto') });
        }

        affida.colture.push(coltura);
        await affida.save();

        logger.db('UPDATE', 'AffidaLotto', true, { id: req.params.id, colturaAdded: coltura });
        res.status(200).json({
            message: req.t('success.coltura_added'),
            colture: affida.colture
        });

    } catch (error) {
        logger.error('Error adding coltura', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.adding_coltura'), error });
    }
};

exports.removeColtura = async (req, res) => {
    const colturaToRemove = req.params.coltura; 

    try {
        const affida = await AffidaLotto.findById(req.params.id);
        if (!affida) {
            logger.warn('Affidamento not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.affidamento_lotto') });
        }

        const index = affida.colture.indexOf(colturaToRemove);
        if (index === -1) {
            logger.warn('coltura not found in affidamento', { id: req.params.id, coltura: colturaToRemove });
            return res.status(404).json({ message: req.t('notFound.coltura') });
        }

        affida.colture.splice(index, 1);
        await affida.save();

        logger.db('UPDATE', 'AffidaLotto', true, { id: req.params.id, colturaRemoved: colturaToRemove });
        res.status(200).json({
            message: req.t('success.coltura_removed'),
            colture: affida.colture
        });

    } catch (error) {
        logger.error('Error removing coltura', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.removing_coltura'), error });
    }
};
