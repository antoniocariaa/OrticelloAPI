const Utente = require('../model/user/utente');
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


exports.getComuneUtenti = async (req, res) => {
    try {
        const utenti = await Utente.find({ tipo: 'comu' }).select('-password');
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
        // Estraiamo i dati dal body
        const { nome, cognome, codicefiscale, email, password, indirizzo, telefono, tipo, associazione, comune, admin } = req.body;

        //Controllo esistenza email
        const existingUtente = await Utente.findOne({ email });
        if (existingUtente) {
            logger.warn('Email already exists', { email });
            return res.status(409).json({ message: req.t('validation.email_exists') });
        }

        // Hashing della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creazione dell'oggetto base (campi comuni)
        // impostiamo 'citt' come default se il tipo non è specificato
        const userType = tipo || 'citt';

        const baseData = {
            nome,
            cognome,
            codicefiscale,
            email,
            password: hashedPassword,
            indirizzo,
            telefono,
            tipo: userType
        };

        // Logica condizionale per i campi specifici (Associazione vs Comune vs Cittadino)        
        if (userType === 'asso') {
            if (!associazione) {
                return res.status(400).json({ message: "Il campo 'associazione' è obbligatorio per il tipo 'asso'" });
            }
            baseData.associazione = associazione;
            baseData.admin = (admin !== undefined) ? admin : false; // Default false se non specificato
        }
        else if (userType === 'comu') {
            if (!comune) {
                return res.status(400).json({ message: "Il campo 'comune' è obbligatorio per il tipo 'comu'" });
            }
            baseData.comune = comune;
            baseData.admin = (admin !== undefined) ? admin : false; // Default false se non specificato
        }

        // Salvataggio
        const nuovoUtente = new Utente(baseData);

        logger.debug('Creating new utente', { email: nuovoUtente.email });
        const savedUtente = await nuovoUtente.save();

        logger.db('INSERT', 'Utente', true, { id: savedUtente._id, email: savedUtente.email });

        // Preparazione risposta (rimozione password)
        const utenteResponse = savedUtente.toObject();
        delete utenteResponse.password;

        res.status(201).json({
            message: req.t('success.utente_created'),
            utente: utenteResponse,
            self: `/api/v1/utenti/${savedUtente._id}`
        });

    } catch (error) {
        // Gestione errori di validazione Mongoose
        if (error.name === 'ValidationError') {
            logger.db('INSERT', 'Utente', false, { error: error.message, data: req.body });

            // Estrae tutti i messaggi di errore in un array
            const errorMessages = Object.values(error.errors).map(e => e.message);

            return res.status(400).json({
                message: req.t('errors.validation_error'),
                errors: errorMessages
            });
        }

        // Gestione errori generici
        logger.error('Error creating utente', error);
        res.status(500).json({ message: req.t('errors.creating_utente'), error: error.message });
    }
};

exports.updateUtente = async (req, res) => {
    try {
        logger.debug('Updating utente', { id: req.params.id, data: req.body });
        const utenteId = req.params.id;
        const updateData = req.body;

        const updatedUtente = await Utente.findByIdAndUpdate(utenteId, updateData, { new: true, runValidators: true }).select('-password');

        if (!updatedUtente) {
            logger.warn('Utente not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        logger.db('UPDATE', 'Utente', true, { id: req.params.id, email: updatedUtente.email });
        res.status(200).json({
            message: req.t('success.utente_updated'),
            utente: updatedUtente
        });

    } catch (error) {
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
    try {
        logger.debug('Deleting utente', { id: req.params.id });
        const utenteId = req.params.id;

        const utente = await Utente.findById(utenteId);
        if (!utente) {
            logger.warn('Utente not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (await bcrypt.compare(req.body.password, utente.password)) {
            await Utente.findByIdAndDelete(utenteId);
            logger.db('DELETE', 'Utente', true, { id: req.params.id, email: utente.email });
            return res.status(200).json({ message: req.t('success.utente_deleted') });
        } else {
            logger.warn('Authentication failed for utente deletion', { id: req.params.id });
            return res.status(401).json({ message: req.t('errors.authentication_error') });
        }

    } catch (error) {
        logger.db('DELETE', 'Utente', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_utente'), error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {

        logger.debug('Updating utente password', { id: req.params.id });
        const utenteId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const utente = await Utente.findById(utenteId);
        if (!utente) {
            logger.warn('Utente not found for password update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        const isMatch = await bcrypt.compare(oldPassword, utente.password);
        if (!isMatch) {
            logger.warn('Old password incorrect for utente password update', { id: req.params.id });
            return res.status(401).json({ message: req.t('validation.old_password_incorrect') });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        utente.password = hashedNewPassword;
        logger.db('UPDATE', 'Utente', true, { id: req.params.id, email: utente.email });
        await utente.save();

        res.status(200).json({ message: req.t('success.password_updated') });
    } catch (error) {
        logger.db('UPDATE', 'Utente', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_password'), error: error.message });
    }
}

exports.removeComuneRole = async (req, res) => {
    try {
        const utenteId = req.params.id;
        logger.debug('Removing comune role from utente', { id: utenteId });

        const utente = await Utente.findById(utenteId);
        if (!utente) {
            logger.warn('Utente not found for role removal', { id: utenteId });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (utente.tipo !== 'comu') {
            return res.status(400).json({ message: 'L\'utente non è di tipo comune' });
        }

        await Utente.updateOne(
            { _id: utenteId },
            {
                $set: { tipo: 'citt', admin: false },
                $unset: { comune: 1 }
            }
        );

        const updatedUtente = await Utente.findById(utenteId).select('-password');

        logger.db('UPDATE', 'Utente', true, { id: utenteId, action: 'removeComuneRole' });
        res.status(200).json({
            message: req.t('success.comune_role_removed'),
            utente: updatedUtente
        });
    } catch (error) {
        logger.db('UPDATE', 'Utente', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_utente'), error: error.message });
    }
};

exports.addComuneMember = async (req, res) => {
    try {
        const { email, admin, comune } = req.body;
        logger.debug('Adding comune member', { email, admin, comune });

        if (!email) {
            return res.status(400).json({ message: req.t('validation.required_field') });
        }

        const comuneId = comune || null;

        const utente = await Utente.findOne({ email });
        if (!utente) {
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (utente.tipo === 'comu') {
            return res.status(400).json({ message: req.t('members.already_comune') });
        }

        if (utente.tipo !== 'citt') {
            return res.status(400).json({ message: req.t('members.not_citizen') });
        }

        await Utente.updateOne(
            { _id: utente._id },
            {
                $set: {
                    tipo: 'comu',
                    comune: comuneId,
                    admin: admin || false
                }
            }
        );

        const updatedUtente = await Utente.findById(utente._id).select('-password');

        logger.db('UPDATE', 'Utente', true, { id: utente._id, action: 'addComuneMember' });
        res.status(200).json({
            message: req.t('success.comune_member_added'),
            utente: updatedUtente
        });
    } catch (error) {
        logger.db('UPDATE', 'Utente', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.updating_utente'), error: error.message });
    }
};

exports.getAssociazioneUtenti = async (req, res) => {
    try {
        const loggedUser = await Utente.findById(req.loggedUser.id);
        const associazioneId = loggedUser?.associazione;
        const utenti = await Utente.find({ tipo: 'asso', associazione: associazioneId }).select('-password');
        logger.db('SELECT', 'Utente', true, { count: utenti.length });
        res.status(200).json(utenti);
    } catch (error) {
        logger.db('SELECT', 'Utente', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_utenti'), error: error.message });
    }
};

exports.getUtentiByAssociazioneId = async (req, res) => {
    try {
        const associazioneId = req.params.id;
        logger.debug('Fetching utenti by associazione ID', { associazioneId });

        const utenti = await Utente.find({ associazione: associazioneId }).select('-password');

        logger.db('SELECT', 'Utente', true, { count: utenti.length, associazioneId });
        res.status(200).json(utenti);
    } catch (error) {
        logger.db('SELECT', 'Utente', false, { error: error.message, associazioneId: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_utenti'), error: error.message });
    }
};

exports.removeAssociazioneRole = async (req, res) => {
    try {
        const utenteId = req.params.id;
        logger.debug('Removing associazione role from utente', { id: utenteId });

        const loggedUser = await Utente.findById(req.loggedUser.id);
        const utente = await Utente.findById(utenteId);

        if (!utente) {
            logger.warn('Utente not found for role removal', { id: utenteId });
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (utente.tipo !== 'asso') {
            return res.status(400).json({ message: 'L\'utente non è di tipo associazione' });
        }

        if (loggedUser.tipo === 'asso') {
            if (!loggedUser.associazione || !utente.associazione || loggedUser.associazione.toString() !== utente.associazione.toString()) {
                return res.status(403).json({ message: req.t('errors.authorization_error') });
            }
        } else if (loggedUser.tipo === 'comu') {

        } else {
            return res.status(403).json({ message: req.t('errors.authorization_error') });
        }

        await Utente.updateOne(
            { _id: utenteId },
            {
                $set: { tipo: 'citt', admin: false },
                $unset: { associazione: 1 }
            }
        );

        const updatedUtente = await Utente.findById(utenteId).select('-password');

        logger.db('UPDATE', 'Utente', true, { id: utenteId, action: 'removeAssociazioneRole' });
        res.status(200).json({
            message: req.t('success.associazione_role_removed'),
            utente: updatedUtente
        });
    } catch (error) {
        logger.db('UPDATE', 'Utente', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_utente'), error: error.message });
    }
};

exports.updateAssociazioneMember = async (req, res) => {
    try {
        const { id, admin } = req.body;

        if (!id) {
            return res.status(400).json({ message: req.t('validation.required_field') });
        }

        const loggedUser = await Utente.findById(req.loggedUser.id);
        const utente = await Utente.findById(id);

        if (!utente) {
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (utente.tipo !== 'asso') {
            return res.status(400).json({ message: 'L\'utente non è di tipo associazione' });
        }

        // Permission Check
        if (loggedUser.tipo === 'asso') {
            if (!loggedUser.associazione || !utente.associazione || loggedUser.associazione.toString() !== utente.associazione.toString()) {
                return res.status(403).json({ message: req.t('errors.authorization_error') });
            }
        } else if (loggedUser.tipo === 'comu') {
            // Allowed
        } else {
            return res.status(403).json({ message: req.t('errors.authorization_error') });
        }

        utente.admin = admin;
        await utente.save();

        const updatedUtente = await Utente.findById(utente._id).select('-password');

        logger.db('UPDATE', 'Utente', true, { id: utente._id, action: 'updateAssociazioneMember', admin });
        res.status(200).json({
            message: req.t('success.utente_updated'),
            utente: updatedUtente
        });

    } catch (error) {
        logger.db('UPDATE', 'Utente', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.updating_utente'), error: error.message });
    }
};

exports.addAssociazioneMember = async (req, res) => {
    try {
        const { email, admin, associazione } = req.body;

        if (!email) {
            return res.status(400).json({ message: req.t('validation.required_field') });
        }

        const loggedUser = await Utente.findById(req.loggedUser.id);

        let associazioneId;

        // If the user is an admin of an association, use their association ID
        if (loggedUser.tipo === 'asso') {
            if (!loggedUser.associazione) {
                logger.warn('Admin user has no associazione reference', { id: req.loggedUser.id });
                return res.status(400).json({ message: 'Admin user has no associazione reference' });
            }
            associazioneId = loggedUser.associazione;
        }
        // If the user is a comune user, they must provide the association ID
        else if (loggedUser.tipo === 'comu') {
            if (!associazione) {
                return res.status(400).json({ message: "Il campo 'associazione' è obbligatorio per gli utenti del comune" });
            }
            associazioneId = associazione;
        } else {
            return res.status(403).json({ message: req.t('errors.authorization_error') });
        }

        logger.debug('Adding associazione member', { email, admin, associazioneId });

        const utente = await Utente.findOne({ email });
        if (!utente) {
            return res.status(404).json({ message: req.t('notFound.utente') });
        }

        if (utente.tipo === 'asso') {
            return res.status(400).json({ message: req.t('members_asso.already_asso') });
        }

        if (utente.tipo !== 'citt') {
            return res.status(400).json({ message: req.t('members_asso.not_citizen') });
        }

        utente.tipo = 'asso';
        utente.associazione = associazioneId;
        utente.admin = admin || false;
        await utente.save();

        const updatedUtente = await Utente.findById(utente._id).select('-password');

        logger.db('UPDATE', 'Utente', true, { id: utente._id, action: 'addAssociazioneMember', associazione: associazioneId });
        res.status(200).json({
            message: req.t('success.associazione_member_added'),
            utente: updatedUtente
        });
    } catch (error) {
        logger.db('UPDATE', 'Utente', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.updating_utente'), error: error.message });
    }
};

exports.downgradeAssociationMembers = async (req, res) => {
    try {
        const associazioneId = req.params.id;
        logger.debug('Downgrading members of associazione', { id: associazioneId });

        const result = await Utente.updateMany(
            { associazione: associazioneId },
            {
                $set: { tipo: 'citt' },
                $unset: { associazione: 1, admin: 1 }
            }
        );

        logger.db('UPDATE', 'Utente', true, {
            action: 'downgradeAssociationMembers',
            associazioneId,
            modifiedCount: result.modifiedCount
        });

        res.status(200).json({
            message: req.t('success.members_downgraded'),
            count: result.modifiedCount
        });
    } catch (error) {
        logger.db('UPDATE', 'Utente', false, { error: error.message, associazioneId: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_utente'), error: error.message });
    }
};
