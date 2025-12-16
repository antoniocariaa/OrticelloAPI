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

exports.createUtente = async (req, res) => {
    try {
        const { nome, cognome, codicefiscale, email, password, indirizzo, telefono, tipo, associazione, comune, admin } = req.body;

        const existingUtente = await Utente.findOne({ email });
        if (existingUtente) {
            return res.status(409).json({ message: 'Utente già esistente con questa email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuovoUtente = new Utente({
            nome,
            cognome,
            codicefiscale,
            email,
            password: hashedPassword,
            indirizzo,
            telefono,
            tipo: tipo || 'citt'
        });

        if (tipo === 'asso' && associazione) {
            nuovoUtente.associazione = associazione;
            nuovoUtente.admin = admin || false;
        }

        if (tipo === 'comu' && comune) {
            nuovoUtente.comune = comune;
            nuovoUtente.admin = admin || false;
        }

        const savedUtente = await nuovoUtente.save();

        const utenteResponse = savedUtente.toObject();
        delete utenteResponse.password;

        res.status(201).json({
            message: 'Utente creato con successo',
            utente: utenteResponse,
            self: `/api/v1/utenti/${savedUtente._id}`
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Errore di validazione', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: 'Errore nella creazione dell\'utente', error: error.message });
    }
};

exports.updateUtente = async (req, res) => {
    try{
        const utenteId = req.params.id;
        const updateData = req.body;
        
        const updatedUtente = await Utente.findByIdAndUpdate(utenteId, updateData, { new: true, runValidators: true }).select('-password');
        
        if(!updatedUtente){
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.status(200).json({
            message: 'Utente aggiornato con successo',
            utente: updatedUtente
        });

    } catch(error){
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Errore di validazione', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'utente', error: error.message });
    }
};

exports.deleteUtente = async (req, res) => {
    try{
        const utenteId = req.params.id;

        const utente = await Utente.findById(utenteId);
        if(!utente){
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        if (await bcrypt.compare(req.body.password, utente.password)) {
            await Utente.findByIdAndDelete(utenteId);
            return res.status(200).json({ message: 'Utente cancellato con successo' });
        }else{
            return res.status(401).json({ message: 'Password errata. Cancellazione non autorizzata.' });
        }
        
    } catch(error){
        res.status(500).json({ message: 'Errore nella cancellazione dell\'utente', error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try{
        const utenteId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const utente = await Utente.findById(utenteId);
        if(!utente){
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        const isMatch = await bcrypt.compare(oldPassword, utente.password);
        if(!isMatch){
            return res.status(401).json({ message: 'Password attuale errata' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        utente.password = hashedNewPassword;
        await utente.save();

        res.status(200).json({ message: 'Password aggiornata con successo' });
    } catch(error){
        res.status(500).json({ message: 'Errore nell\'aggiornamento della password', error: error.message });
    }   
}