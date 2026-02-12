const bando = require('../model/announcement/bando');
const logger = require('../config/logger');

exports.getAllBandi = async (req, res) => {
    try {
        // Gestione Filtri (RF26 e RF15.2)
        // Se nell'URL c'è ?active=true, mostriamo solo i bandi non scaduti
        let query = {};
        if (req.query.active === 'true') {
            query.data_fine = { $gte: new Date() }; // $gte = Greater Than or Equal (Data futura)
        }

        logger.debug('Fetching all bandi', { filters: req.query });

        // RF26.3: Ordinamento per data di scadenza (i più urgenti prima)
        const bandi = await bando.find(query).sort({ data_fine: 1 });

        res.status(200).json(bandi);
    }
    catch (error) {
        logger.error('Error retrieving bandi', { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_bandi'), error });
    }
};

exports.getBandiAttivi = async (req, res) => {
    try {
        const now = new Date();

        // Filtra i bandi che sono già iniziati e non ancora terminati
        const query = {
            data_inizio: { $lte: now },  // Già iniziati
            data_fine: { $gte: now }     // Non ancora terminati
        };

        logger.debug('Fetching active bandi', { currentDate: now });

        // Ordinamento per data di scadenza (i più urgenti prima)
        const bandiAttivi = await bando.find(query).sort({ data_fine: 1 });

        res.status(200).json(bandiAttivi);
    }
    catch (error) {
        logger.error('Error retrieving active bandi', { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_bandi'), error });
    }
};

exports.createBando = async (req, res) => {
    try {
        // Validazione logica base: La fine non può essere prima dell'inizio
        if (req.body.data_inizio && req.body.data_fine) {
            if (new Date(req.body.data_fine) < new Date(req.body.data_inizio)) {
                return res.status(400).json({ message: "La data di fine deve essere successiva alla data di inizio." });
            }
        }

        const newBando = new bando(req.body);
        const savedBando = await newBando.save();

        logger.db('INSERT', 'Bando', true, { id: savedBando._id, titolo: savedBando.titolo });
        res.status(201).json({ data: savedBando, message: req.t('success.bando_created') });
    } catch (error) {
        // Gestione errore di validazione Mongoose (es. campi mancanti)
        if (error.name === 'ValidationError') {
            logger.warn('Validation error creating bando', { error: error.message });
            return res.status(400).json({ message: req.t('errors.invalid_input'), error: error.message });
        }

        logger.error('Error creating bando', { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_bando'), error });
    }
};

exports.getBandoById = async (req, res) => {
    try {
        const result = await bando.findById(req.params.id);
        if (!result) {
            logger.warn('Bando not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error retrieving bando by ID', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_bando'), error });
    }
};

exports.updateBando = async (req, res) => {
    try {
        const updatedBando = await bando.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // runValidators assicura che i dati aggiornati siano validi
        );

        if (!updatedBando) {
            logger.warn('Bando not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        logger.db('UPDATE', 'Bando', true, { id: req.params.id });
        res.status(200).json({ data: updatedBando, message: req.t('success.bando_updated') });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: req.t('errors.invalid_input'), error: error.message });
        }
        logger.error('Error updating bando', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_bando'), error });
    }
};

exports.deleteBando = async (req, res) => {
    try {
        const deletedBando = await bando.findByIdAndDelete(req.params.id);
        if (!deletedBando) {
            logger.warn('Bando not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        logger.db('DELETE', 'Bando', true, { id: req.params.id });
        res.status(200).json({ message: req.t('success.bando_deleted') });
    } catch (error) {
        logger.error('Error deleting bando', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_bando'), error });
    }
};