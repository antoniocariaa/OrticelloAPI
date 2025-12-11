const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Swagger JSDoc configuration options
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.4',
    info: {
      title: 'Orticello API',
      version: '1.0.0',
      description: 'API for managing community gardens (orti urbani) in Trento',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      },
      {
        url: 'https://orticelloapi.onrender.com',
        description: 'Production server'
      }
    ],
    tags: [
      { name: 'Orti', description: 'Garden management endpoints' },
      { name: 'Lotti', description: 'Plot management endpoints' },
      { name: 'Utenti', description: 'User management endpoints' },
      { name: 'Associazioni', description: 'Association management endpoints' },
      { name: 'Comune', description: 'Municipality management endpoints' },
      { name: 'AffidaLotti', description: 'Plot assignment endpoints' },
      { name: 'AffidaOrti', description: 'Garden assignment endpoints' },
      { name: 'Avvisi', description: 'Notice management endpoints' },
      { name: 'Bandi', description: 'Competition announcement endpoints' },
      { name: 'Meteo', description: 'Weather data endpoints' },
      { name: 'Sensor', description: 'Sensor data endpoints' }
    ],
    components: {
      schemas: {
        Orto: {
          type: 'object',
          required: ['nome', 'indirizzo', 'comune'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439011'
            },
            nome: {
              type: 'string',
              description: 'Name of the garden',
              example: 'Orto San Bartolomeo'
            },
            indirizzo: {
              type: 'string',
              description: 'Address of the garden',
              example: 'Via San Bartolomeo 15, Trento'
            },
            comune: {
              type: 'string',
              description: 'Reference to Comune ObjectId',
              example: '507f1f77bcf86cd799439015'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of creation (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last update (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            }
          }
        },
        Lotto: {
          type: 'object',
          required: ['dimensione', 'sensori'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439012'
            },
            dimensione: {
              type: 'number',
              description: 'Size of the plot in square meters',
              example: 50
            },
            sensori: {
              type: 'boolean',
              description: 'Whether the plot is equipped with sensors',
              example: true
            }
          }
        },
        Associazione: {
          type: 'object',
          required: ['nome', 'indirizzo', 'telefono', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439014'
            },
            nome: {
              type: 'string',
              description: 'Name of the association',
              example: 'Associazione Orti Urbani Trento'
            },
            indirizzo: {
              type: 'string',
              description: 'Address of the association',
              example: 'Via delle Associazioni 45, Trento'
            },
            telefono: {
              type: 'string',
              description: 'Phone number (mobile format validated)',
              example: '+393331234567'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address (unique, validated)',
              example: 'info@ortiurbanitrento.it'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of creation (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last update (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            }
          }
        },
        Comune: {
          type: 'object',
          required: ['nome', 'indirizzo', 'telefono', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439015'
            },
            nome: {
              type: 'string',
              description: 'Name of the municipality',
              example: 'Comune di Trento'
            },
            indirizzo: {
              type: 'string',
              description: 'Address of the municipality',
              example: 'Piazza Duomo 1, Trento'
            },
            telefono: {
              type: 'string',
              description: 'Phone number of the municipality',
              example: '+390461884111'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address (unique, validated)',
              example: 'info@comune.trento.it'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of creation (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last update (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            }
          }
        },
        Utente: {
          type: 'object',
          required: ['nome', 'cognome', 'codicefiscale', 'email', 'indirizzo', 'telefono', 'tipo'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439016'
            },
            nome: {
              type: 'string',
              description: 'First name of the user',
              example: 'Mario'
            },
            cognome: {
              type: 'string',
              description: 'Last name of the user',
              example: 'Rossi'
            },
            codicefiscale: {
              type: 'string',
              description: 'Italian tax ID (validated)',
              example: 'RSSMRA80A01H501U'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address (unique, validated)',
              example: 'mario.rossi@example.com'
            },
            password: {
              type: 'string',
              description: 'Password (hashed in future implementation)',
              writeOnly: true,
              example: 'securePassword123'
            },
            indirizzo: {
              type: 'string',
              description: 'User address',
              example: 'Via Roma 10, Trento'
            },
            telefono: {
              type: 'string',
              description: 'Mobile phone number (validated)',
              example: '+393331234567'
            },
            tipo: {
              type: 'string',
              enum: ['citt', 'asso', 'comu'],
              description: 'User type (citt=citizen, asso=association, comu=municipality)',
              default: 'citt',
              example: 'citt'
            },
            associazione: {
              type: 'string',
              description: 'Reference to Associazione (required if tipo=asso)',
              example: '507f1f77bcf86cd799439014'
            },
            comune: {
              type: 'string',
              description: 'Reference to Comune (required if tipo=comu)',
              example: '507f1f77bcf86cd799439015'
            },
            admin: {
              type: 'boolean',
              description: 'Admin flag (required if tipo != citt)',
              default: false,
              example: false
            }
          }
        },
        AffidaLotto: {
          type: 'object',
          required: ['lotto', 'utente', 'data_inizio', 'data_fine'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439017'
            },
            lotto: {
              type: 'string',
              description: 'Reference to Lotto ObjectId',
              example: '507f1f77bcf86cd799439012'
            },
            utente: {
              type: 'string',
              description: 'Reference to Utente ObjectId',
              example: '507f1f77bcf86cd799439016'
            },
            data_inizio: {
              type: 'string',
              format: 'date',
              description: 'Assignment start date',
              example: '2025-01-01'
            },
            data_fine: {
              type: 'string',
              format: 'date',
              description: 'Assignment end date',
              example: '2025-12-31'
            },
            colture: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of crops planted by the user',
              example: ['Pomodori', 'Zucchine', 'Insalata']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of creation (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last update (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            }
          }
        },
        AffidaOrto: {
          type: 'object',
          required: ['orto', 'associazione', 'data_inizio', 'data_fine'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439018'
            },
            orto: {
              type: 'string',
              description: 'Reference to Orto ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            associazione: {
              type: 'string',
              description: 'Reference to Associazione ObjectId',
              example: '507f1f77bcf86cd799439014'
            },
            data_inizio: {
              type: 'string',
              format: 'date',
              description: 'Assignment start date',
              example: '2025-01-01'
            },
            data_fine: {
              type: 'string',
              format: 'date',
              description: 'Assignment end date',
              example: '2025-12-31'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of creation (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last update (generated automatically)',
              readOnly: true,
              example: '2025-12-11T10:30:00.000Z'
            }
          }
        },
        Avviso: {
          type: 'object',
          required: ['titolo', 'tipo', 'data', 'messaggio'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439019'
            },
            titolo: {
              type: 'string',
              description: 'Notice title',
              example: 'Chiusura per manutenzione'
            },
            tipo: {
              type: 'string',
              enum: ['asso', 'comu'],
              description: 'Notice type (asso=association, comu=municipality)',
              default: 'asso',
              example: 'comu'
            },
            comune: {
              type: 'string',
              description: 'Reference to Comune (required if tipo=comu)',
              example: '507f1f77bcf86cd799439015'
            },
            associazione: {
              type: 'string',
              description: 'Reference to Associazione (required if tipo=asso)',
              example: '507f1f77bcf86cd799439014'
            },
            data: {
              type: 'string',
              format: 'date',
              description: 'Notice date',
              example: '2025-12-15'
            },
            target: {
              type: 'string',
              enum: ['asso', 'all'],
              description: 'Target audience (required if tipo=comu)',
              default: 'all',
              example: 'all'
            },
            messaggio: {
              type: 'string',
              description: 'Notice message content',
              example: 'Gli orti rimarranno chiusi per manutenzione dal 20 al 25 dicembre'
            },
            categoria: {
              type: 'string',
              description: 'Optional category',
              example: 'manutenzione'
            }
          }
        },
        Bando: {
          type: 'object',
          required: ['titolo', 'data_inizio', 'data_fine', 'messaggio'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439020'
            },
            titolo: {
              type: 'string',
              description: 'Competition announcement title',
              example: 'Bando per assegnazione lotti 2026'
            },
            data_inizio: {
              type: 'string',
              format: 'date',
              description: 'Application period start date',
              example: '2026-01-01'
            },
            data_fine: {
              type: 'string',
              format: 'date',
              description: 'Application period end date',
              example: '2026-01-31'
            },
            messaggio: {
              type: 'string',
              description: 'Competition announcement message',
              example: 'Sono aperti i bandi per l\'assegnazione dei lotti per l\'anno 2026'
            },
            link: {
              type: 'string',
              description: 'Optional link to full announcement',
              example: 'https://www.comune.trento.it/bandi/orti-2026'
            }
          }
        },
        Meteo: {
          type: 'object',
          required: ['coordinate', 'timestamp'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439021'
            },
            coordinate: {
              type: 'object',
              required: ['lat', 'lng'],
              properties: {
                lat: {
                  type: 'number',
                  description: 'Latitude in decimal degrees (WGS84)',
                  example: 46.0664
                },
                lng: {
                  type: 'number',
                  description: 'Longitude in decimal degrees (WGS84)',
                  example: 11.1257
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Observation timestamp',
              example: '2025-12-11T14:30:00.000Z'
            },
            rilev: {
              type: 'string',
              description: 'Meteorological reading or notes (TODO - structure to be defined)',
              example: 'Temperature: 15°C, Humidity: 65%'
            }
          }
        },
        Sensor: {
          type: 'object',
          required: ['lotto', 'timestamp'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId (generated automatically)',
              readOnly: true,
              example: '507f1f77bcf86cd799439022'
            },
            lotto: {
              type: 'string',
              description: 'Reference to Lotto ObjectId',
              example: '507f1f77bcf86cd799439012'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Reading timestamp',
              example: '2025-12-11T14:30:00.000Z'
            },
            rilev: {
              type: 'string',
              description: 'Sensor payload (TODO - structure to be defined)',
              example: 'Soil moisture: 45%, Temperature: 18°C'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

/**
 * Calculate hash of all route files to detect changes
 * @returns {string} MD5 hash of combined route file contents
 */
function calculateRoutesHash() {
  const routesDir = path.join(__dirname, '../routes');
  const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));
  
  let combinedContent = '';
  routeFiles.forEach(file => {
    const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
    combinedContent += content;
  });
  
  return crypto.createHash('md5').update(combinedContent).digest('hex');
}

/**
 * Generate OpenAPI specification and save to YAML file if routes have changed
 * @param {Object} swaggerSpec - The generated swagger specification
 */
function saveOpenAPISpec(swaggerSpec) {
  const openapiPath = path.join(__dirname, '../../doc/openapi3.yaml');
  const hashFilePath = path.join(__dirname, '../../doc/.openapi.hash');

  try {
    const currentHash = calculateRoutesHash();
    let shouldRegenerate = true;
    
    // Check if hash file exists and compare
    if (fs.existsSync(hashFilePath)) {
      const previousHash = fs.readFileSync(hashFilePath, 'utf8');
      if (previousHash === currentHash) {
        shouldRegenerate = false;
        console.log('✓ OpenAPI specification is up to date');
      }
    }
    
    if (shouldRegenerate) {
      const yaml = require('yaml');
      const yamlContent = yaml.stringify(swaggerSpec);
      
      // Ensure doc directory exists
      const docDir = path.join(__dirname, '../../doc');
      if (!fs.existsSync(docDir)) {
        fs.mkdirSync(docDir, { recursive: true });
      }
      
      fs.writeFileSync(openapiPath, yamlContent, 'utf8');
      fs.writeFileSync(hashFilePath, currentHash, 'utf8');
      console.log('✓ OpenAPI specification regenerated at doc/openapi3.yaml');
    }
  } catch (error) {
    console.error('Warning: Could not save OpenAPI spec to file:', error.message);
  }
}

/**
 * Initialize Swagger documentation
 * @returns {Object} Generated swagger specification
 */
function initializeSwagger() {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  saveOpenAPISpec(swaggerSpec);
  return swaggerSpec;
}

module.exports = {
  initializeSwagger,
  swaggerOptions
};
