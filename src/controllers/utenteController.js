const Utente = require('../model/utente');
const bcrypt = require('bcrypt');

exports.getAllUtenti = async (req, res) => {
    try {
        const utenti = await Utente.find().select('-password'); 
        res.status(200).json(utenti);
    } catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_utenti'), error: error.message });
    }
};

exports.getUtenteById = async (req, res) => {
    try {
        const utente = await Utente.findById(req.params.id).select('-password');
        
        if (!utente) {
            return res.status(404).json({ message: req.t('notFound.utente') });
        }
        res.status(200).json(utente);
    } catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_utente'), error: error.message });
    }
};

exports.createUtente = async (req, res) => {
    try {
        const { nome, cognome, codicefiscale, email, password, indirizzo, telefono, tipo, associazione, comune, admin } = req.body;

        const existingUtente = await Utente.findOne({ email });
        if (existingUtente) {
            return res.status(409).json({ message: req.t('validation.email_exists') });
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
            message: req.t('success.utente_created'),
            utente: utenteResponse,
            self: `/api/v1/utenti/${savedUtente._id}`
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: req.t('errors.validation_error'), 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: req.t('errors.creating_utente'), error: error.message });
    }
};

exports.updateUtente = async (req, res) => {
    try{
        const utenteId = req.params.id;
        const updateData = req.body;
        
        const updatedUtente = await Utente.findByIdAndUpdate(utenteId, updateData, { new: true, runValidators: true }).select('-password');
        
        if(!updatedUtente){
            return res.status(404).json({ message: req.t('notFound.utente') });
        }
        res.status(200).json({
            message: req.t('success.utente_updated'),
            utente: updatedUtente
        });

    } catch(error){
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: req.t('errors.validation_error'), 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: req.t('errors.updating_utente'), error: error.message });
    }
};

exports.deleteUtente = async (req, res) => {
    try{
        const utenteId = req.params.id;

        const utente = await Utente.findById(utenteId);
        if(!utente){
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (await bcrypt.compare(req.body.password, utente.password)) {
            await Utente.findByIdAndDelete(utenteId);
            return res.status(200).json({ message: req.t('success.utente_deleted') });
        }else{
            return res.status(401).json({ message: req.t('errors.authentication_error') });
        }
        
    } catch(error){
        res.status(500).json({ message: req.t('errors.deleting_utente'), error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try{
        const utenteId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const utente = await Utente.findById(utenteId);
        if(!utente){
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        const isMatch = await bcrypt.compare(oldPassword, utente.password);
        if(!isMatch){
            return res.status(401).json({ message: req.t('validation.old_password_incorrect') });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        utente.password = hashedNewPassword;
        await utente.save();

        res.status(200).json({ message: req.t('success.password_updated') });
    } catch(error){
        res.status(500).json({ message: req.t('errors.updating_password'), error: error.message });
    }   
}