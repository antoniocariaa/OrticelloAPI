const AffidaLotto = require('../model/assignment/affidaLotto');
const logger = require('../config/logger');

exports.getAllAffidaLotti = async (req, res) => {
    try {
        const affidamenti = await AffidaLotto.find()
            .populate("lotto")
            .populate("utente");
        res.status(200).json(affidamenti);
    } catch (error) {
        logger.error('Error retrieving affidamenti', { error: error.message });
        res.status(500).json({ message: "Errore nel recupero degli affidamenti", error });
    }
};

exports.getAffidaLottiAttivi = async (req, res) => {
    try {
        const now = new Date();
        const query = {
            stato: 'accepted',
            data_inizio: { $lte: now },
            data_fine: { $gte: now }
        };

        const affidamentiAttivi = await AffidaLotto.find(query)
            .populate("lotto")
            .populate("utente")
            .sort({ data_fine: 1 });

        res.status(200).json(affidamentiAttivi);
    } catch (error) {
        logger.error('Error retrieving active affida lotti', { error: error.message });
        res.status(500).json({ message: "Errore nel recupero affidamenti attivi", error });
    }
};

exports.createAffidaLotto = async (req, res) => {
    try {
        const userId = req.loggedUser.id || req.loggedUser._id;

        const payload = {
            ...req.body,
            utente: userId,
            data_richiesta: new Date(),
            stato: 'pending'
        };

        const newAffidamento = new AffidaLotto(payload);
        const saved = await newAffidamento.save();

        logger.db('INSERT', 'AffidaLotto', true, { id: saved._id });
        res.status(201).json({ message: "Richiesta inviata con successo", data: saved });
    } catch (error) {
        logger.error('Error creating affidamento', { error: error.message, data: req.body });
        res.status(500).json({ message: "Errore durante la creazione della richiesta", error });
    }
};

// GESTIONE APPROVAZIONE / RIFIUTO
exports.gestisciRichiesta = async (req, res) => {
    const { id } = req.params;
    const { azione } = req.body; // 'accetta' o 'rifiuta'

    try {
        const richiesta = await AffidaLotto.findById(id);

        if (!richiesta) {
            return res.status(404).json({ message: "Richiesta non trovata" });
        }

        if (azione === 'accetta') {
            const now = new Date();
            const dataFine = new Date();
            dataFine.setFullYear(now.getFullYear() + 1); // Dura 1 anno

            // AGGIORNAMENTO STATO E DATE
            richiesta.stato = 'accepted';
            richiesta.data_inizio = now;
            richiesta.data_fine = dataFine;

            await richiesta.save();

            logger.db('UPDATE', 'AffidaLotto', true, { id, action: 'approved' });
            return res.status(200).json({ message: "Richiesta approvata con successo", data: richiesta });

        } else if (azione === 'rifiuta') {
            richiesta.stato = 'rejected';
            await richiesta.save();

            logger.db('UPDATE', 'AffidaLotto', true, { id, action: 'rejected' });
            return res.status(200).json({ message: "Richiesta rifiutata" });
        } else {
            return res.status(400).json({ message: "Azione non valida" });
        }

    } catch (error) {
        logger.error('Error managing request', { error: error.message, id });
        res.status(500).json({ message: "Errore gestione richiesta", error });
    }
};

exports.getAffidaLottoById = async (req, res) => {
    try {
        const affidamento = await AffidaLotto.findById(req.params.id)
            .populate("lotto")
            .populate("utente");
        if (!affidamento) {
            return res.status(404).json({ message: "Affidamento non trovato" });
        }
        res.status(200).json(affidamento);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dettaglio", error });
    }
};

exports.updateAffidaLotto = async (req, res) => {
    try {
        const updated = await AffidaLotto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Non trovato" });
        res.status(200).json({ message: "Aggiornato con successo", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Errore aggiornamento", error });
    }
};

exports.deleteAffidaLotto = async (req, res) => {
    try {
        const deleted = await AffidaLotto.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Non trovato" });
        res.status(200).json({ message: "Eliminato con successo" });
    } catch (error) {
        res.status(500).json({ message: "Errore eliminazione", error });
    }
};

exports.addColtura = async (req, res) => {
    const { coltura } = req.body;
    if (!coltura) return res.status(400).json({ message: "Nome coltura obbligatorio" });

    try {
        const affida = await AffidaLotto.findById(req.params.id);
        if (!affida) return res.status(404).json({ message: "Affidamento non trovato" });

        affida.colture.push(coltura);
        await affida.save();
        res.status(200).json({ message: "Coltura aggiunta", colture: affida.colture });
    } catch (error) {
        res.status(500).json({ message: "Errore aggiunta coltura", error });
    }
};

exports.removeColtura = async (req, res) => {
    const colturaToRemove = req.params.coltura;
    try {
        const affida = await AffidaLotto.findById(req.params.id);
        if (!affida) return res.status(404).json({ message: "Affidamento non trovato" });

        const index = affida.colture.indexOf(colturaToRemove);
        if (index === -1) return res.status(404).json({ message: "Coltura non trovata" });

        affida.colture.splice(index, 1);
        await affida.save();
        res.status(200).json({ message: "Coltura rimossa", colture: affida.colture });
    } catch (error) {
        res.status(500).json({ message: "Errore rimozione coltura", error });
    }
};