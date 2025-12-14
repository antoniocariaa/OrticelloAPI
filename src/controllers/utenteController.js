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

        // Check if user already exists
        const existingUtente = await Utente.findOne({ email });
        if (existingUtente) {
            return res.status(409).json({ message: 'Utente già esistente con questa email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
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

        // Add optional fields based on tipo
        if (tipo === 'asso' && associazione) {
            nuovoUtente.associazione = associazione;
            nuovoUtente.admin = admin || false;
        }

        if (tipo === 'comu' && comune) {
            nuovoUtente.comune = comune;
            nuovoUtente.admin = admin || false;
        }

        // Save to database
        const savedUtente = await nuovoUtente.save();

        // Return without password
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