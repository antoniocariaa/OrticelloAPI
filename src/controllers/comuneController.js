const Comune = require('../model/org/comune');

exports.getAllComuni = async (req, res) => {
    try {
        const comuni = await Comune.find();
        res.status(200).json(comuni);
    } catch (error) {
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
            return res.status(404).json({ message: req.t('notFound.comune') });
        }
        
        res.status(200).json(comune);
    } catch (error) {
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
        
        res.status(201).json({ data: comuneSalvato, message: req.t('success.comune_created') });
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ 
                message: req.t('errors.invalid_duplicate_data'), 
                error: error.message 
            });
        }
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
            return res.status(404).json({ message: req.t('notFound.comune') });
        }

        res.status(200).json({ data: comuneAggiornato, message: req.t('success.comune_updated') });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: req.t('errors.invalid_duplicate_data'), 
                error: error.message 
            });
        }
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
            return res.status(404).json({ message: req.t('notFound.comune') });
        }

        res.status(200).json({ message: req.t('success.comune_deleted') });
    } catch (error) {
        res.status(500).json({ 
            message: req.t('errors.deleting_comune'), 
            error: error.message 
        });
    }
};