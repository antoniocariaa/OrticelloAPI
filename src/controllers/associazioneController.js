const Associazione = require('../model/org/associazione');

exports.getAllAssociazioni = async (req, res) => {
    try {
        const associazioni = await Associazione.find();
        res.status(200).json(associazioni);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero delle associazioni', 
            error: error.message 
        });
    }
};

exports.getAssociazioneById = async (req, res) => {
    try {
        const associazione = await Associazione.findById(req.params.id);
        
        if (!associazione) {
            return res.status(404).json({ message: 'Associazione non trovata' });
        }
        
        res.status(200).json(associazione);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero dell\'associazione', 
            error: error.message 
        });
    }
};

exports.createAssociazione = async (req, res) => {
    try {
        const nuovaAssociazione = new Associazione(req.body);
        const associazioneSalvata = await nuovaAssociazione.save();
        
        res.status(201).json(associazioneSalvata);
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ 
                message: 'Dati non validi o duplicati', 
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Errore nella creazione dell\'associazione', 
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
            return res.status(404).json({ message: 'Associazione non trovata' });
        }

        res.status(200).json(associazioneAggiornata);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Dati aggiornati non validi', 
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Errore nell\'aggiornamento dell\'associazione', 
            error: error.message 
        });
    }
};

exports.deleteAssociazione = async (req, res) => {
    try {
        const associazioneEliminata = await Associazione.findByIdAndDelete(req.params.id);

        if (!associazioneEliminata) {
            return res.status(404).json({ message: 'Associazione non trovata' });
        }

        res.status(200).json({ message: 'Associazione eliminata con successo' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore durante l\'eliminazione', 
            error: error.message 
        });
    }
};