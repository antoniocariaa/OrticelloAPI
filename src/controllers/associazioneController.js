const Associazione = require('../model/org/associazione');
const Utente = require('../model/utente');
const logger = require('../config/logger');

exports.getAllAssociazioni = async (req, res) => {
    try {
        const associazioni = await Associazione.find();
        res.status(200).json(associazioni);
    } catch (error) {
        logger.error('Error retrieving associazioni', { error: error.message });
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
            logger.warn('Associazione not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }
        
        res.status(200).json(associazione);
    } catch (error) {
        logger.error('Error retrieving associazione by ID', { error: error.message, id: req.params.id });
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

        logger.db('INSERT', 'Associazione', true, { id: associazioneSalvata._id });
        res.status(201).json({ data: associazioneSalvata, message: req.t('success.associazione_created') });
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            logger.db('INSERT', 'Associazione', false, { error: error.message, data: req.body });
            return res.status(400).json({ 
                message: req.t('validation.invalid_duplicate_data'), 
                error: error.message 
            });
        }
        logger.error('Error creating associazione', { error: error.message, data: req.body });
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
            logger.warn('Associazione not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        res.status(200).json({ data: associazioneAggiornata, message: req.t('success.associazione_updated') });
    } catch (error) {
        if (error.name === 'ValidationError') {
            logger.db('UPDATE', 'Associazione', false, { error: error.message, id: req.params.id });
            return res.status(400).json({ 
                message: req.t('validation.invalid_duplicate_data'), 
                error: error.message 
            });
        }
        logger.error('Error updating associazione', { error: error.message, id: req.params.id });
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
            logger.warn('Associazione not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        logger.db('DELETE', 'Associazione', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.associazione_deleted') });
    } catch (error) {
        logger.error('Error deleting associazione', { error: error.message, id: req.params.id });
        res.status(500).json({ 
            message: req.t('errors.deleting_associazione'), 
            error: error.message 
        });
    }
};

exports.addMember = async (req, res) => {
    try {
        const associazioneId = req.params.id;
        const { utenteId } = req.body;

        // Verifica che l'associazione esista
        const associazione = await Associazione.findById(associazioneId);
        if (!associazione) {
            logger.warn('Associazione not found for adding member', { id: associazioneId });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        // Verifica che l'utente esista
        const utente = await Utente.findById(utenteId);
        if (!utente) {
            logger.warn('Utente not found for adding to associazione', { utenteId, associazioneId });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        // Verifica che l'utente non sia già associato
        if (utente.associazione && utente.associazione.toString() === associazioneId) {
            logger.warn('Utente already member of associazione', { utenteId, associazioneId });
            return res.status(400).json({ 
                message: req.t('validation.member_already_exists') 
            });
        }

        // Aggiorna l'utente per renderlo membro dell'associazione
        utente.tipo = 'asso';
        utente.associazione = associazioneId;
        await utente.save();

        logger.db('UPDATE', 'Utente', true, { 
            id: utenteId, 
            associazioneId,
            action: 'added_to_associazione' 
        });

        res.status(200).json({ 
            message: req.t('success.member_added'), 
            data: {
                utente: {
                    id: utente._id,
                    nome: utente.nome,
                    cognome: utente.cognome,
                    email: utente.email,
                    tipo: utente.tipo
                },
                associazione: {
                    id: associazione._id,
                    nome: associazione.nome
                }
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            logger.db('UPDATE', 'Utente', false, { 
                error: error.message, 
                associazioneId: req.params.id,
                utenteId: req.body.utenteId
            });
            return res.status(400).json({ 
                message: req.t('validation.invalid_duplicate_data'), 
                error: error.message 
            });
        }
        logger.error('Error adding member to associazione', { 
            error: error.message, 
            associazioneId: req.params.id,
            utenteId: req.body.utenteId 
        });
        res.status(500).json({ 
            message: req.t('errors.adding_member'), 
            error: error.message 
        });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const associazioneId = req.params.id;
        const { utenteId } = req.params;

        // Verifica che l'associazione esista
        const associazione = await Associazione.findById(associazioneId);
        if (!associazione) {
            logger.warn('Associazione not found for removing member', { id: associazioneId });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        // Verifica che l'utente esista
        const utente = await Utente.findById(utenteId);
        if (!utente) {
            logger.warn('Utente not found for removing from associazione', { utenteId, associazioneId });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        // Verifica che l'utente sia effettivamente membro di questa associazione
        if (!utente.associazione || utente.associazione.toString() !== associazioneId) {
            logger.warn('Utente is not member of this associazione', { utenteId, associazioneId });
            return res.status(400).json({ 
                message: req.t('validation.member_not_found') 
            });
        }

        // Rimuovi l'associazione dall'utente e cambia il tipo a cittadino
        utente.tipo = 'citt';
        utente.associazione = undefined;
        utente.admin = false;
        await utente.save();

        logger.db('UPDATE', 'Utente', true, { 
            id: utenteId, 
            associazioneId,
            action: 'removed_from_associazione' 
        });

        res.status(200).json({ 
            message: req.t('success.member_removed'),
            data: {
                utente: {
                    id: utente._id,
                    nome: utente.nome,
                    cognome: utente.cognome,
                    email: utente.email,
                    tipo: utente.tipo
                }
            }
        });
    } catch (error) {
        logger.error('Error removing member from associazione', { 
            error: error.message, 
            associazioneId: req.params.id,
            utenteId: req.params.utenteId 
        });
        res.status(500).json({ 
            message: req.t('errors.removing_member'), 
            error: error.message 
        });
    }
};

exports.getMembers = async (req, res) => {
    try {
        const associazioneId = req.params.id;

        // Verifica che l'associazione esista
        const associazione = await Associazione.findById(associazioneId);
        if (!associazione) {
            logger.warn('Associazione not found for getting members', { id: associazioneId });
            return res.status(404).json({ message: req.t('notFound.associazione') });
        }

        // Trova tutti gli utenti che appartengono a questa associazione
        const membri = await Utente.find({ 
            associazione: associazioneId,
            tipo: 'asso'
        }).select('nome cognome email telefono admin createdAt');

        logger.db('SELECT', 'Utente', true, { 
            associazioneId,
            count: membri.length 
        });

        res.status(200).json({
            associazione: {
                id: associazione._id,
                nome: associazione.nome
            },
            count: membri.length,
            membri
        });
    } catch (error) {
        logger.error('Error getting members of associazione', { 
            error: error.message, 
            associazioneId: req.params.id 
        });
        res.status(500).json({ 
            message: req.t('errors.retrieving_members'), 
            error: error.message 
        });
    }
};