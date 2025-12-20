const Utente = require('../model/utente');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');

exports.getAllUtenti = async (req, res) => {
    try {
        const utenti = await Utente.find().select('-password'); 
        logger.db('SELECT', 'Utente', true, { count: utenti.length });
        res.status(200).json(utenti);
    } catch (error) {
        logger.db('SELECT', 'Utente', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_utenti'), error: error.message });
    }
};

exports.getUtenteById = async (req, res) => {
    try {
        logger.debug('Fetching utente by ID', { id: req.params.id });
        const utente = await Utente.findById(req.params.id).select('-password');
        
        if (!utente) {
            logger.warn('Utente not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        logger.db('SELECT', 'Utente', true, { id: req.params.id });
        res.status(200).json(utente);
    } catch (error) {
        logger.db('SELECT', 'Utente', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_utente'), error: error.message });
    }
};

exports.createUtente = async (req, res) => {
    try {
        const { nome, cognome, codicefiscale, email, password, indirizzo, telefono, tipo, associazione, comune, admin } = req.body;

        const existingUtente = await Utente.findOne({ email });
        if (existingUtente) {
            logger.warn('Email already exists', { email });
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

        logger.debug('Creating new utente', { email: nuovoUtente.email });
        const savedUtente = await nuovoUtente.save();
        logger.db('INSERT', 'Utente', true, { id: savedUtente._id, email: savedUtente.email });

        const utenteResponse = savedUtente.toObject();
        delete utenteResponse.password;

        res.status(201).json({
            message: req.t('success.utente_created'),
            utente: utenteResponse,
            self: `/api/v1/utenti/${savedUtente._id}`
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            logger.db('INSERT', 'Utente', false, { error: error.message, data: req.body });
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
        logger.debug('Updating utente', { id: req.params.id, data: req.body });
        const utenteId = req.params.id;
        const updateData = req.body;
        
        const updatedUtente = await Utente.findByIdAndUpdate(utenteId, updateData, { new: true, runValidators: true }).select('-password');
        
        if(!updatedUtente){
            logger.warn('Utente not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        logger.db('UPDATE', 'Utente', true, { id: req.params.id, email: updatedUtente.email });
        res.status(200).json({
            message: req.t('success.utente_updated'),
            utente: updatedUtente
        });

    } catch(error){
        logger.db('UPDATE', 'Utente', false, { error: error.message, id: req.params.id });
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
        logger.debug('Deleting utente', { id: req.params.id });
        const utenteId = req.params.id;

        const utente = await Utente.findById(utenteId);
        if(!utente){
            logger.warn('Utente not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (await bcrypt.compare(req.body.password, utente.password)) {
            await Utente.findByIdAndDelete(utenteId);
            logger.db('DELETE', 'Utente', true, { id: req.params.id, email: utente.email });
            return res.status(200).json({ message: req.t('success.utente_deleted') });
        }else{
            logger.warn('Authentication failed for utente deletion', { id: req.params.id });
            return res.status(401).json({ message: req.t('errors.authentication_error') });
        }
        
    } catch(error){
        logger.db('DELETE', 'Utente', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_utente'), error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try{

        logger.debug('Updating utente password', { id: req.params.id });
        const utenteId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const utente = await Utente.findById(utenteId);
        if(!utente){
            logger.warn('Utente not found for password update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        const isMatch = await bcrypt.compare(oldPassword, utente.password);
        if(!isMatch){
            logger.warn('Old password incorrect for utente password update', { id: req.params.id });
            return res.status(401).json({ message: req.t('validation.old_password_incorrect') });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        utente.password = hashedNewPassword;
        logger.db('UPDATE', 'Utente', true, { id: req.params.id, email: utente.email });
        await utente.save();

        res.status(200).json({ message: req.t('success.password_updated') });
    } catch(error){
        logger.db('UPDATE', 'Utente', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_password'), error: error.message });
    }   
}