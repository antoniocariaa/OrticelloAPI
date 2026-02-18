<div align="center">

<!-- Spazio riservato per il logo dell'applicazione -->
<img src="./doc/logo.png" alt="Orticello Logo" width="400"/>

**Sistema di gestione intelligente per orti urbani comunitari**

[![Node.js](https://img.shields.io/badge/Node.js->=20.19.0-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.16.3-blue.svg)](https://expressjs.com/)

[Documentazione API](#-documentazione-api) • [Caratteristiche](#-caratteristiche-principali) • [Installazione](#-installazione) • [Team](#-team)

</div>

---

## 📖 Descrizione

**Orticello** è una piattaforma RESTful API completa per la gestione degli orti urbani comunitari della città di Trento. L'applicazione facilita l'amministrazione dei terreni coltivabili, la gestione delle assegnazioni ai cittadini, il monitoraggio ambientale e la comunicazione tra comuni, associazioni e utenti.

### 🎯 Obiettivi

- 🏡 Semplificare la gestione degli orti urbani
- 👥 Connettere cittadini, associazioni e amministrazioni comunali
- 📊 Monitorare le condizioni ambientali con sensori IoT
- 📢 Facilitare la comunicazione attraverso avvisi e bandi
- 🌍 Supportare la sostenibilità urbana e l'agricoltura locale

---

## ✨ Caratteristiche Principali

### 🔐 Autenticazione e Autorizzazione
- Sistema JWT per autenticazione sicura
- Gestione ruoli multi-livello (Cittadini, Associazioni, Comuni)
- Controllo accessi basato su permessi granulari

### 🗺️ Gestione Geospaziale
- Localizzazione orti e lotti con coordinate GeoJSON
- Query geospaziali avanzate (ricerca per distanza e area)
- Indicizzazione MongoDB 2dsphere per performance ottimali

### 🌿 Amministrazione Orti e Lotti
- Gestione completa di orti urbani e singoli lotti
- Sistema di assegnazione e affidamento terreni
- Tracciamento stato e disponibilità lotti

### 📡 Monitoraggio Ambientale
- Integrazione dati sensori IoT in tempo reale
- Raccolta dati meteorologici
- Storico condizioni ambientali

### 📣 Comunicazione
- Sistema avvisi per comuni e associazioni
- Gestione bandi di concorso
- Notifiche mirate agli utenti

### 🌐 Internazionalizzazione
- Supporto multilingua (🇮🇹 Italiano, 🇬🇧 Inglese, 🇩🇪 Tedesco)
- Rilevamento automatico lingua preferita
- Messaggi di errore localizzati

### 🤖 AI Integration
- Integrazione Google Generative AI
- Consigli personalizzati per la coltivazione

---

## 🏗️ Architettura

### Stack Tecnologico

```
Backend Framework:  Express.js 4.16.3
Database:          MongoDB 9.0.0 con Mongoose ODM
Autenticazione:    JWT + bcrypt
Documentazione:    OpenAPI 3.0 / Swagger
Testing:           Jest + Supertest
Security:          Helmet, CORS, Validator
```

### Struttura Moduli

```
📦 Orticello API
├── 🏡 Orti (Gardens)           - Gestione orti urbani
├── 📐 Lotti (Plots)            - Gestione singoli lotti coltivabili
├── 👤 Utenti (Users)           - Gestione utenti (cittadini, admin)
├── 🏢 Associazioni             - Gestione associazioni di quartiere
├── 🏛️ Comune (Municipality)   - Gestione enti comunali
├── 🤝 Affidamenti              - Assegnazioni orti e lotti
├── 📢 Avvisi (Notices)         - Comunicazioni pubbliche
├── 📋 Bandi (Competitions)     - Bandi di assegnazione
├── 🌤️ Meteo (Weather)         - Dati meteorologici
└── 📡 Sensori (Sensors)        - Dati sensori ambientali
```

---

## 🚀 Installazione

### Prerequisiti

- Node.js >= 20.19.0
- npm >= 10.0.0
- MongoDB (locale o cloud)

### Setup

```bash
# Clona il repository
git clone https://github.com/your-repo/orticello.git

# Entra nella directory
cd orticello

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env
# Modifica .env con le tue configurazioni

# Avvia l'applicazione
npm start

# Oppure in modalità sviluppo
npm run dev
```

### Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/orticello

# Server
PORT=8080

# JWT
JWT_SECRET=your-secret-key-here

# Google AI (opzionale)
GOOGLE_API_KEY=your-google-api-key
```

---

## 📚 Documentazione API

La documentazione interattiva completa è disponibile tramite Swagger UI:

```
http://localhost:8080/api-docs
```

### Endpoints Principali

| Risorsa | Endpoint | Descrizione |
|---------|----------|-------------|
| 🔐 Auth | `/api/v1/authentication` | Login e registrazione |
| 🏡 Orti | `/api/v1/orti` | CRUD orti urbani |
| 📐 Lotti | `/api/v1/lotti` | CRUD lotti coltivabili |
| 👤 Utenti | `/api/v1/utenti` | Gestione utenti |
| 🏢 Associazioni | `/api/v1/associazioni` | Gestione associazioni |
| 📢 Avvisi | `/api/v1/avvisi` | Gestione comunicazioni |
| 📋 Bandi | `/api/v1/bandi` | Gestione bandi |
| 🌤️ Meteo | `/api/v1/meteo` | Dati meteorologici |
| 📡 Sensori | `/api/v1/sensor` | Dati sensori IoT |

### Esempio Richiesta

```javascript
// Autenticazione
const response = await fetch('http://localhost:8080/api/v1/authentication/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Richiesta autenticata
const orti = await fetch('http://localhost:8080/api/v1/orti', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Language': 'it'
  }
});
```

---

## 🧪 Testing

```bash
# Esegui tutti i test
npm test

# Test con coverage
npm test -- --coverage

# Test specifici
npm test -- controllers/ortoController.test.js
```

### Copertura Test

- ✅ Controller tests
- ✅ Utility middleware tests
- ✅ Authentication tests

---

## 🌍 Internazionalizzazione

L'API supporta richieste multilingua:

```bash
# Query parameter
GET /api/v1/orti?lang=en

# Header personalizzato
X-Language: de

# Accept-Language (automatico)
Accept-Language: en-US,en;q=0.9
```

---

## 🔒 Sicurezza

- 🔐 Autenticazione JWT con token expiration
- 🔑 Password hashing con bcrypt
- ✅ Validazione input con validator.js
- 🛡️ CORS configurato
- 🔍 Sanitizzazione dati
- 📝 Logging completo richieste ed errori

---

## 📊 Logging

Sistema di logging strutturato per:
- ✅ Richieste HTTP
- ❌ Errori applicativi
- 🔌 Connessioni database
- ⚠️ Avvisi di sistema

---

## 👥 Team

Sviluppato con ❤️ da:

- **Ali Raja Faizan**
- **Antonio Caria**
- **Federico Pedron**

---

## 📞 Contatti

Per domande o supporto, apri una issue su GitHub.

---

<div align="center">

**Coltiva il futuro verde delle città! 🌱🏙️**

</div>