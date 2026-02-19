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

### 🗺️ Gestione Spaziale
- Localizzazione orti e lotti

### 🌿 Amministrazione Orti e Lotti
- Gestione completa di orti urbani e singoli lotti
- Sistema di assegnazione e affidamento terreni
- Tracciamento stato e disponibilità lotti

### 📣 Comunicazione
- Sistema avvisi per comuni e associazioni
- Gestione bandi di concorso

### 🌐 Internazionalizzazione
- Supporto multilingua (🇮🇹 Italiano, 🇬🇧 Inglese, 🇩🇪 Tedesco)
- Rilevamento automatico lingua preferita

### 🤖 AI Integration
- Integrazione Generative AI
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
Security:          CORS, Validator
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
# Avvia l'applicazione
npm start

# Oppure in modalità sviluppo
npm run dev
```

## 📚 Documentazione API

La documentazione interattiva completa è disponibile tramite Swagger UI:

```
https://orticelloapi.onrender.com/api-docs
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

---

## 🧪 Testing

```bash
# Esegui tutti i test
npm test

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
