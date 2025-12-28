const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const sensor = require('../model/climate/meteo');

// Mock del model meteo
jest.mock('../model/climate/meteo');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../util/checkToken', () => (req, res, next) => {
  req.user = { id: 'testUserId', email: 'test@test.com' };
  next();
});

describe('MeteoController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/meteo', () => {
    test('should return all meteo data with status 200', async () => {
      const mockMeteoData = [
        {
          _id: '507f1f77bcf86cd799439011',
          temperatura: 25.5,
          umidita: 60,
          pressione: 1013,
          data_rilevazione: '2024-01-01T00:00:00.000Z'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          temperatura: 22.3,
          umidita: 65,
          pressione: 1015,
          data_rilevazione: '2024-01-02T00:00:00.000Z'
        }
      ];

      sensor.find.mockResolvedValue(mockMeteoData);

      const response = await request(app)
        .get('/api/v1/meteo')
        .expect(200);

      expect(sensor.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockMeteoData);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      sensor.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/meteo')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero di dati meteo');
    });
  });

  describe('GET /api/v1/meteo/:id', () => {
    test('should return meteo data by ID with status 200', async () => {
      const mockMeteo = {
        _id: '507f1f77bcf86cd799439011',
        temperatura: 25.5,
        umidita: 60,
        pressione: 1013,
        data_rilevazione: '2024-01-01T00:00:00.000Z'
      };

      sensor.findById.mockResolvedValue(mockMeteo);

      const response = await request(app)
        .get('/api/v1/meteo/507f1f77bcf86cd799439011')
        .expect(200);

      expect(sensor.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockMeteo);
    });

    test('should return 404 when meteo data not found', async () => {
      sensor.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/meteo/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Rilevamento meteorologico non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      sensor.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/meteo/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero di dati meteo');
    });
  });
});
