const Utente = require('../model/utente');
const bcrypt = require('bcrypt');

exports.getAllUtenti = async (req, res) => {
    try {
        const utenti = await Utente.find().select('-password'); 
        res.status(200).json(utenti);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero degli utenti', error: error.message });
    }
};

exports.getUtenteById = async (req, res) => {
    try {
        const utente = await Utente.findById(req.params.id).select('-password');
        
        if (!utente) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.status(200).json(utente);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dell\'utente', error: error.message });
    }
};

