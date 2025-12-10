const Comune = require('../model/org/comune');

exports.getAllComuni = async (req, res) => {
    try {
        const comuni = await Comune.find();
        res.status(200).json(comuni);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero dei comuni', 
            error: error.message 
        });
    }
};

exports.getComuneById = async (req, res) => {
    try {
        const comune = await Comune.findById(req.params.id);
        
        if (!comune) {
            return res.status(404).json({ message: 'Comune non trovato' });
        }
        
        res.status(200).json(comune);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero del comune', 
            error: error.message 
        });
    }
};

exports.createComune = async (req, res) => {
    try {
        const nuovoComune = new Comune(req.body);
        const comuneSalvato = await nuovoComune.save();
        
        res.status(201).json(comuneSalvato);
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ 
                message: 'Dati non validi o duplicati', 
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Errore nella creazione del comune', 
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
            return res.status(404).json({ message: 'Comune non trovato' });
        }

        res.status(200).json(comuneAggiornato);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Dati aggiornati non validi', 
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Errore nell\'aggiornamento del comune', 
            error: error.message 
        });
    }
};

exports.deleteComune = async (req, res) => {
    try {
        const comuneEliminato = await Comune.findByIdAndDelete(req.params.id);

        if (!comuneEliminato) {
            return res.status(404).json({ message: 'Comune non trovato' });
        }

        res.status(200).json({ message: 'Comune eliminato con successo' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore durante l\'eliminazione', 
            error: error.message 
        });
    }
};