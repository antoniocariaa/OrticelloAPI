var mongoose = require("mongoose");
var validator = require('validator');
var Schema = mongoose.Schema;

/**
 * @typedef {Object} Utente
 * @description Modello utente (utenteSchema) per Mongoose.
 * @property {string} nome - Nome dell'utente. Obbligatorio.
 * @property {string} cognome - Cognome dell'utente. Obbligatorio.
 * @property {string} codicefiscale - Codice fiscale. Obbligatorio. Validato con validator.isTaxID.
 * @property {string} email - Indirizzo email univoco. Obbligatorio. Validato con validator.isEmail.
 * @property {string} password - Password (idealmente hash). Obbligatoria.
 * @property {string} indirizzo - Indirizzo dell'utente. Obbligatorio.
 * @property {string} telefono - Numero di telefono cellulare. Obbligatorio. Validato con validator.isMobilePhone.
 * @property {"citt"|"asso"|"comu"} tipo - Tipologia utente; predefinito "citt". Obbligatorio.
 * @property {import("mongoose").Types.ObjectId} [associazione] - Riferimento ad Associazione; richiesto quando tipo === "asso".
 * @property {import("mongoose").Types.ObjectId} [comune] - Riferimento a Comune; richiesto quando tipo === "comu".
 * @property {boolean} admin - Flag amministratore; richiesto quando tipo !== "citt". Predefinito false.
 */
var utenteSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  cognome: {
    type: String,
    required: true
  },
  codicefiscale: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // EU countries tax ID validation
        const euLocales = [
          'it-IT', // Italy
          'de-DE', // Germany
          'fr-FR', // France
          'es-ES', // Spain
          'at-AT', // Austria
          'hr-HR', // Croatia
          'lu-LU', // Luxembourg
          'mt-MT', // Malta
          'si-SI', // Slovenia
        ];
        
        // Check if valid for any EU country
        return euLocales.some(locale => validator.isTaxID(v, locale));
      },
      message: '{VALUE} non è un codice fiscale valido per nessun paese dell\'UE'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return validator.isEmail(v);
      },
      message: '{VALUE} non è un\'email valida'
    }
  },
  password: {
    type: String,
    required: true

    // TO DO IMPLEMENTARE HASHING...
    /*
    
        // hash the password
        userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        };

        // checking if password is valid
        userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
        };
            
        main.js

        app.post('/register', function(req, res) {
            var new_user = new User({
            username: req.body.username
            });

        new_user.password = new_user.generateHash(req.body.password);
        new_user.save();
        });

        app.post('/login', function(req, res) {
        User.findOne({username: req.body.username}, function(err, user) {

            if (!user.validPassword(req.body.password)) {
            //password did not match
            } else {
            // password matched. proceed forward
            }
        });
    
    */
  },
  indirizzo: {
    type: String,
    required: true
  },
    telefono: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return validator.isMobilePhone(v);
      },
      message: '{VALUE} non è un numero di telefono valido'
    }
  },
  tipo: {
    type: String,
    required: true,
    enum: ['citt', 'asso', 'comu'],
    default: 'citt'           
  },
  associazione: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Associazione',
    required: function() {
      return this.tipo === 'asso';
    },
    validate: {
      validator: function(v) {
        // riferimento ad Associazione deve essere presente solo se tipo è 'asso'
        if (this.tipo === 'asso') {
          return v != null;
        } else {
          return v == null;
        }
      },
      message: 'Il campo associazione deve essere presente solo per utenti di tipo "asso"'
    }
  },
  comune: {
    // Riferimento al modello Comune
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comune',
    required: function() {
      return this.tipo === 'comu';
    },
    validate: {
      validator: function(v) {
        // Se tipo è 'comu', il campo deve essere presente
        // Se tipo NON è 'comu', il campo deve essere null/undefined
        if (this.tipo === 'comu') {
          return v != null;
        } else {
          return v == null;
        }
      },
      message: 'Il campo comune deve essere presente solo per utenti di tipo "comu"'
    }
  },
  admin: {
    type: Boolean,
    required: function() {
      return this.tipo !== 'citt';
    },
    default: false
  }
});


module.exports = mongoose.model("Utente", utenteSchema, "utente");