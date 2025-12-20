# Sistema di Logging - Orticello API

## Panoramica

Sistema di logging completo e configurabile per tracciare tutte le operazioni importanti dell'API.

## Caratteristiche

✅ **Completamente configurabile** tramite variabili d'ambiente  
✅ **4 livelli di log**: error, warn, info, debug  
✅ **Output flessibile**: console, file, o entrambi  
✅ **Formato strutturato** con timestamp e contesto  
✅ **Logging specializzato** per HTTP, DB, Auth  
✅ **Rotazione automatica** dei file di log  
✅ **Possibilità di disabilitare** completamente  

## Configurazione

### Variabili d'Ambiente

Tutte le configurazioni sono gestite tramite variabili d'ambiente nel file `.env`:

```bash
# Abilita/disabilita logging
LOG_ENABLED=true

# Livello di log (error | warn | info | debug)
LOG_LEVEL=info

# Output su console
LOG_TO_CONSOLE=true

# Output su file
LOG_TO_FILE=false

# Percorso file di log
LOG_FILE_PATH=logs/app.log
```

### Livelli di Log

| Livello | Descrizione | Quando usare |
|---------|-------------|--------------|
| `error` | Solo errori critici | Produzione |
| `warn` | Errori + warnings | Produzione |
| `info` | Informazioni generali + errori + warnings | Staging/Produzione |
| `debug` | Tutti i dettagli inclusi debug | Sviluppo |

### Configurazioni Consigliate

#### Sviluppo Locale
```bash
LOG_ENABLED=true
LOG_LEVEL=debug
LOG_TO_CONSOLE=true
LOG_TO_FILE=false
```

#### Produzione
```bash
LOG_ENABLED=true
LOG_LEVEL=warn
LOG_TO_CONSOLE=true
LOG_TO_FILE=true
LOG_FILE_PATH=/var/log/orticello/app.log
```

#### Testing
```bash
LOG_ENABLED=false
```

## Utilizzo

### Nel Codice

```javascript
const logger = require('./config/logger');

// Log generale
logger.info('Operazione completata');
logger.error('Errore critico', { error: err.message });
logger.warn('Attenzione', { details: 'qualcosa da notare' });
logger.debug('Debug info', { data: someData });

// Log HTTP (automatico tramite middleware)
logger.http(req, 200, 'Request processed');

// Log Database
logger.db('INSERT', 'Orto', true, { id: orto._id });
logger.db('UPDATE', 'Utente', false, { error: 'Validation failed' });

// Log Autenticazione
logger.auth('LOGIN', userId, true, { method: 'email' });
logger.auth('REGISTER', email, false, { reason: 'Email exists' });
```

### Middleware Automatici

Il sistema include middleware che loggano automaticamente:

#### 1. Request Logger
Logga tutte le richieste HTTP in arrivo e le risposte:
```
[2024-12-17T10:30:45.123Z] [INFO] | {"method":"GET","url":"/api/v1/orti","statusCode":200} - Request completed in 145ms
```

#### 2. Error Logger
Logga tutti gli errori non gestiti con stack trace completo:
```
[2024-12-17T10:30:45.123Z] [ERROR] | {"error":"ValidationError","stack":"..."} - Unhandled error
```

## Formato dei Log

### Console (con colori)
```
[2024-12-17T10:30:45.123Z] [INFO] | {"userId":"123","action":"login"} - User authenticated
```

### File (JSON-like)
```
[2024-12-17T10:30:45.123Z] [ERROR] | {"method":"POST","url":"/api/v1/orti","error":"Validation failed"} - Error creating orto
```

## Rotazione dei Log

I file di log vengono automaticamente ruotati quando superano **10MB**:

```
logs/app.log              # File corrente
logs/app_2024-12-17.log   # File rotato
logs/app_2024-12-16.log   # File rotato precedente
```

## Esempi di Log per Operazione

### 1. Operazioni CRUD

```javascript
// GET /api/v1/orti
[INFO] DB SELECT on Orto: SUCCESS | {"count":15}

// POST /api/v1/orti
[INFO] DB INSERT on Orto: SUCCESS | {"id":"674...","nome":"Orto Nord"}

// PUT /api/v1/orti/:id
[INFO] DB UPDATE on Orto: SUCCESS | {"id":"674..."}

// DELETE /api/v1/orti/:id
[WARN] Orto not found | {"id":"invalid-id"}
[INFO] DB DELETE on Orto: SUCCESS | {"id":"674..."}
```

### 2. Autenticazione

```javascript
// Login riuscito
[INFO] Auth LOGIN for user mario@example.com: SUCCESS | {"userId":"123"}

// Login fallito
[WARN] Auth LOGIN for user mario@example.com: FAILED | {"reason":"Wrong password"}

// Registrazione Google
[INFO] Auth GOOGLE_REGISTER for user nuovo@gmail.com: SUCCESS | {"userId":"456"}
```

### 3. Errori

```javascript
// Errore database
[ERROR] DB SELECT on Orto: FAILED | {"error":"Connection timeout"}

// Errore validazione
[ERROR] DB INSERT on Utente: FAILED | {"error":"Email already exists"}

// Errore non gestito
[ERROR] Unhandled error: Cannot read property 'id' of undefined | {"stack":"..."}
```

### 4. Richieste HTTP

```javascript
// Richiesta normale
[INFO] | {"method":"GET","url":"/api/v1/orti","statusCode":200} - Request completed in 45ms

// Richiesta non trovata
[WARN] 404 - Route not found | {"method":"GET","url":"/api/v1/nonexistent"}

// Richiesta con errore
[ERROR] | {"method":"POST","url":"/api/v1/orti","statusCode":500} - Request completed in 120ms
```

## Best Practices

### 1. Usa il Livello Appropriato

```javascript
// ❌ Non fare
logger.info('Database connection failed');

// ✅ Fare
logger.error('Database connection failed', { error: err.message });
```

### 2. Includi Sempre il Contesto

```javascript
// ❌ Non fare
logger.info('Orto created');

// ✅ Fare
logger.db('INSERT', 'Orto', true, { id: orto._id, nome: orto.nome });
```

### 3. Non Loggare Dati Sensibili

```javascript
// ❌ Non fare
logger.debug('User login', { password: req.body.password });

// ✅ Fare
logger.debug('User login attempt', { email: req.body.email });
```

### 4. Usa Debug per Dettagli di Sviluppo

```javascript
// Durante sviluppo
logger.debug('Processing request', { body: req.body, params: req.params });

// In produzione (LOG_LEVEL=info) questo non verrà registrato
```

## Monitoraggio e Analisi

### Trovare Errori

```bash
# Cerca errori nei log
grep "ERROR" logs/app.log

# Conta gli errori
grep -c "ERROR" logs/app.log

# Ultimi 50 errori
grep "ERROR" logs/app.log | tail -n 50
```

### Analisi Performance

```bash
# Richieste lente (>1000ms)
grep "Request completed" logs/app.log | grep -E "[0-9]{4,}ms"

# Conta richieste per endpoint
grep "Request completed" logs/app.log | grep -oP '"/api/v1/\w+"' | sort | uniq -c
```

### Audit di Sicurezza

```bash
# Login falliti
grep "Auth LOGIN.*FAILED" logs/app.log

# Tentativi di accesso 404
grep "404" logs/app.log
```

## Disabilitare il Logging

### Temporaneamente (per test)
```bash
LOG_ENABLED=false npm test
```

### Permanentemente
Nel file `.env`:
```bash
LOG_ENABLED=false
```

## Struttura File

```
src/
├── config/
│   └── logger.js              # Sistema di logging principale
├── middleware/
│   ├── requestLogger.js       # Middleware per richieste HTTP
│   └── errorLogger.js         # Middleware per errori
└── controllers/
    └── ortoController.js      # Esempio di utilizzo nei controller

logs/                          # Directory log (auto-creata)
└── app.log                    # File di log principale
```

## Integrazione con Servizi Esterni

Il sistema può essere facilmente esteso per integrare servizi di logging cloud:

- **Sentry**: per error tracking
- **LogDNA/Datadog**: per log management
- **ELK Stack**: per analisi avanzata
- **CloudWatch**: per AWS deployment

## Troubleshooting

### I log non appaiono

1. Verifica che `LOG_ENABLED=true`
2. Controlla il livello: `LOG_LEVEL` deve includere il livello che vuoi vedere
3. Se usi file, verifica i permessi di scrittura su `LOG_FILE_PATH`

### File di log troppo grandi

Il sistema ruota automaticamente i file >10MB. Per modificare:

```javascript
// In src/config/logger.js
const maxSize = 5 * 1024 * 1024; // 5MB invece di 10MB
```

### Prestazioni degradate

Se i log rallentano l'applicazione:
- Aumenta `LOG_LEVEL` (es. da debug a info)
- Disabilita `LOG_TO_FILE` in produzione
- Usa servizi esterni di logging asincroni

## Roadmap

- [ ] Integrazione con Sentry
- [ ] Log rotation basato su tempo (daily, weekly)
- [ ] Compressione file di log rotati
- [ ] Export log in formato JSON strutturato
- [ ] Dashboard web per visualizzazione log
- [ ] Alerts automatici per errori critici
