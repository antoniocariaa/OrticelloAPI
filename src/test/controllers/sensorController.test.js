const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const sensor = require('../../model/climate/sensor');

// Mock del model sensor
jest.mock('../../model/climate/sensor');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.user = { id: 'testUserId', email: 'test@test.com' };
  next();
});

describe('SensorController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/sensor', () => {
    test('should return all sensors with status 200', async () => {
      const mockSensors = [
        {
          _id: '507f1f77bcf86cd799439011',
          tipo: 'temperatura',
          valore: 25.5,
          unita_misura: '°C',
          data_rilevazione: '2024-01-01T00:00:00.000Z'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          tipo: 'umidita',
          valore: 60,
          unita_misura: '%',
          data_rilevazione: '2024-01-02T00:00:00.000Z'
        }
      ];

      sensor.find.mockResolvedValue(mockSensors);

      const response = await request(app)
        .get('/api/v1/sensor')
        .expect(200);

      expect(sensor.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockSensors);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      sensor.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/sensor')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero dei sensori');
    });
  });

  describe('GET /api/v1/sensor/:id', () => {
    test('should return sensor by ID with status 200', async () => {
      const mockSensor = {
        _id: '507f1f77bcf86cd799439011',
        tipo: 'temperatura',
        valore: 25.5,
        unita_misura: '°C',
        data_rilevazione: '2024-01-01T00:00:00.000Z'
      };

      sensor.findById.mockResolvedValue(mockSensor);

      const response = await request(app)
        .get('/api/v1/sensor/507f1f77bcf86cd799439011')
        .expect(200);

      expect(sensor.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockSensor);
    });

    test('should return 404 when sensor not found', async () => {
      sensor.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/sensor/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Sensore non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      sensor.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/sensor/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero del sensore');
    });
  });
});


