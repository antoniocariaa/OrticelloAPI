const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Comune = require('../../model/org/comune');

// Mock del model Comune
jest.mock('../../model/org/comune');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.user = { id: 'testUserId', email: 'test@test.com' };
  next();
});

describe('ComuneController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/comune', () => {
    test('should return all comuni with status 200', async () => {
      const mockComuni = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Trento',
          provincia: 'TN',
          regione: 'Trentino-Alto Adige'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          nome: 'Rovereto',
          provincia: 'TN',
          regione: 'Trentino-Alto Adige'
        }
      ];

      Comune.find.mockResolvedValue(mockComuni);

      const response = await request(app)
        .get('/api/v1/comune')
        .expect(200);

      expect(Comune.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockComuni);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      Comune.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/comune')
        .expect(500);

      expect(Comune.find).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Errore nel recupero dei comuni');
    });
  });

  describe('GET /api/v1/comune/:id', () => {
    test('should return comune by ID with status 200', async () => {
      const mockComune = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Trento',
        provincia: 'TN'
      };

      Comune.findById.mockResolvedValue(mockComune);

      const response = await request(app)
        .get('/api/v1/comune/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Comune.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockComune);
    });

    test('should return 404 when comune not found', async () => {
      Comune.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/comune/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Comune non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      Comune.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/comune/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero del comune');
    });
  });

  describe('POST /api/v1/comune', () => {
    test('should create a new comune and return it with status 201', async () => {
      const mockComuneData = {
        nome: 'Pergine Valsugana',
        provincia: 'TN',
        regione: 'Trentino-Alto Adige'
      };

      const mockSavedComune = {
        _id: '507f1f77bcf86cd799439013',
        ...mockComuneData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedComune);
      Comune.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/comune')
        .send(mockComuneData)
        .expect(201);

      expect(Comune).toHaveBeenCalledWith(mockComuneData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Comune creato con successo');
      expect(response.body.data).toMatchObject(mockSavedComune);
    });

    test('should return error 400 for validation error', async () => {
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';

      Comune.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/comune')
        .send({ nome: 'Test' })
        .expect(400);

      expect(response.body.message).toBe('errors.invalid_duplicate_data');
    });

    test('should return error 400 for duplicate key error', async () => {
      const mockError = new Error('Duplicate key');
      mockError.code = 11000;

      Comune.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/comune')
        .send({ nome: 'Trento', provincia: 'TN' })
        .expect(400);

      expect(response.body.message).toBe('errors.invalid_duplicate_data');
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Database error');

      Comune.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/comune')
        .send({ nome: 'Test' })
        .expect(500);

      expect(response.body.message).toBe('Errore nella creazione del comune');
    });
  });

  describe('PUT /api/v1/comune/:id', () => {
    test('should update comune and return it with status 200', async () => {
      const mockUpdatedComune = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Trento',
        provincia: 'TN',
        regione: 'Trentino-Alto Adige'
      };

      Comune.findByIdAndUpdate.mockResolvedValue(mockUpdatedComune);

      const response = await request(app)
        .put('/api/v1/comune/507f1f77bcf86cd799439011')
        .send({ regione: 'Trentino-Alto Adige' })
        .expect(200);

      expect(Comune.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { regione: 'Trentino-Alto Adige' },
        { new: true, runValidators: true }
      );
      expect(response.body.message).toBe('comune aggiornato con successo');
      expect(response.body.data).toMatchObject(mockUpdatedComune);
    });

    test('should return 404 when comune not found', async () => {
      Comune.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/comune/507f1f77bcf86cd799439011')
        .send({ nome: 'Test' })
        .expect(404);

      expect(response.body.message).toBe('Comune non trovato');
    });

    test('should return error 400 for validation error', async () => {
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';

      Comune.findByIdAndUpdate.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/comune/507f1f77bcf86cd799439011')
        .send({ nome: 'Test' })
        .expect(400);

      expect(response.body.message).toBe('errors.invalid_duplicate_data');
    });
  });

  describe('DELETE /api/v1/comune/:id', () => {
    test('should delete comune and return success message with status 200', async () => {
      const mockDeletedComune = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Trento'
      };

      Comune.findByIdAndDelete.mockResolvedValue(mockDeletedComune);

      const response = await request(app)
        .delete('/api/v1/comune/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Comune.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body.message).toBe('Comune eliminato con successo');
    });

    test('should return 404 when comune not found', async () => {
      Comune.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/comune/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Comune non trovato');
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Database error');
      Comune.findByIdAndDelete.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/comune/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe("Errore nell'eliminazione del comune");
    });
  });
});

