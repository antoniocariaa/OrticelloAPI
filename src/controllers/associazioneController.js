const Associazione = require('../model/org/associazione');

exports.getAllAssociazioni = async (req, res) => {
    try {
        const associazioni = await Associazione.find();
        res.status(200).json(associazioni);
    } catch (error) {
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
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }
        
        res.status(200).json(associazione);
    } catch (error) {
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
        
        res.status(201).json({ data: associazioneSalvata, message: req.t('success.associazione_created') });
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ 
                message: req.t('validation.invalid_duplicate_data'), 
                error: error.message 
            });
        }
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
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        res.status(200).json({ data: associazioneAggiornata, message: req.t('success.associazione_updated') });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: req.t('validation.invalid_duplicate_data'), 
                error: error.message 
            });
        }
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
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        res.status(200).json({ message: req.t('success.associazione_deleted') });
    } catch (error) {
        res.status(500).json({ 
            message: req.t('errors.deleting_associazione'), 
            error: error.message 
        });
    }
};