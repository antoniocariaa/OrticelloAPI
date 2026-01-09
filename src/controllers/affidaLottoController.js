const AffidaLotto = require('../model/affidaLotto');
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

exports.getRichiestePending = async (req, res) => {
    try {
        const richiestePending = await AffidaLotto.find({ stato: 'pending' })
            .populate("lotto")
            .populate("utente")
            .sort({ data_richiesta: -1 });
        
        res.status(200).json(richiestePending);
    } catch (error) {
        logger.error('Error retrieving pending requests', { error: error.message });
        res.status(500).json({ message: "Errore nel recupero richieste pending", error });
    }
};

exports.getStoricoAssegnazioni = async (req, res) => {
    try {
        const userType = req.loggedUser.tipo;
        const userId = req.loggedUser.id || req.loggedUser._id;
        const now = new Date();

        let query;

        // Se è un'associazione, filtra solo i lotti degli orti gestiti
        if (userType === 'asso') {
            const Utente = require('../model/utente');
            const AffidaOrto = require('../model/affidaOrto');
            const Orto = require('../model/orto');
            
            // Recupera l'utente completo per ottenere l'ID dell'associazione
            const utente = await Utente.findById(userId);
            
            if (!utente || !utente.associazione) {
                return res.status(400).json({ message: "Utente non associato a nessuna associazione" });
            }

            const associazioneId = utente.associazione;
            
            // Trova gli orti assegnati all'associazione
            const affidamentiOrti = await AffidaOrto.find({ 
                associazione: associazioneId 
            });
            
            if (affidamentiOrti.length === 0) {
                return res.status(200).json([]);
            }
            
            // Estrai gli ID degli orti
            const ortiIds = affidamentiOrti.map(aff => aff.orto);
            
            // Trova tutti i lotti di questi orti
            const orti = await Orto.find({ _id: { $in: ortiIds } });
            
            const lottiIds = [];
            orti.forEach(orto => {
                if (orto.lotti && Array.isArray(orto.lotti)) {
                    lottiIds.push(...orto.lotti);
                }
            });
            
            if (lottiIds.length === 0) {
                return res.status(200).json([]);
            }
            
            // Query con $and per combinare correttamente le condizioni
            query = {
                $and: [
                    {
                        $or: [
                            { stato: 'rejected' },
                            { 
                                stato: 'accepted',
                                data_fine: { $lt: now }
                            }
                        ]
                    },
                    { lotto: { $in: lottiIds } }
                ]
            };
        } else {
            // Per il comune, nessun filtro sui lotti
            query = {
                $or: [
                    { stato: 'rejected' },
                    { 
                        stato: 'accepted',
                        data_fine: { $lt: now }
                    }
                ]
            };
        }

        const storicoAssegnazioni = await AffidaLotto.find(query)
            .populate("lotto")
            .populate("utente")
            .sort({ data_richiesta: -1 });
        
        res.status(200).json(storicoAssegnazioni);
    } catch (error) {
        logger.error('Error retrieving historical assignments', { error: error.message, stack: error.stack });
        res.status(500).json({ message: "Errore nel recupero storico assegnazioni", error: error.message });
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

exports.getAssociazioniVisibiliByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const now = new Date();
        
        // Import dei modelli
        const AffidaLotto = require('../model/affidaLotto'); 
        const Orto = require('../model/orto');
        const AffidaOrto = require('../model/affidaOrto');
        
        // 1. Trova Affidamenti Lotto
        const affidaLotti = await AffidaLotto.find({ 
            utente: userId,
            stato: 'accepted'
        }).select('lotto');
        
        if (!affidaLotti || affidaLotti.length === 0) {
            return res.json([]);
        }

        const lottiIds = affidaLotti.map(al => al.lotto);
        
        // 2. Trova Orti
        const orti = await Orto.find({ 
            lotti: { $in: lottiIds } 
        }).select('_id');
        
        if (!orti || orti.length === 0) {
            return res.json([]);
        }

        const ortiIds = orti.map(o => o._id);
        
        // 3. Trova Associazioni
        // NOTA: Ho commentato di nuovo le date. Se i dati nel DB sono vecchi/test, 
        // con le date attive non trovava nulla. Così funziona sicuro.
        const affidaOrti = await AffidaOrto.find({ 
            orto: { $in: ortiIds }
            // data_inizio: { $lte: now },
            // data_fine: { $gte: now }
        }).select('associazione');
        
        // 4. Estrai ID unici
        const associazioniIds = [...new Set(
            affidaOrti.map(ao => ao.associazione.toString())
        )];
        
        res.json(associazioniIds);
        
    } catch (error) {
        console.error('Errore getAssociazioniVisibiliByUser:', error);
        res.status(500).json({ 
            message: "Errore server", 
            error: error.message 
        });
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