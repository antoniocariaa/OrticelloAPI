const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Lotto = require('../../model/lotto');

// Mock del model Lotto
jest.mock('../../model/lotto');

// Mock del middleware di autenticazione
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.loggedUser = { id: 'testUserId', email: 'test@test.com', tipo: 'comu', admin: false };
  next();
});

describe('LottoController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/lotti', () => {
    test('should return all lotti with status 200', async () => {
      const mockLotti = [
        {
          _id: '507f1f77bcf86cd799439011',
          numero: 1,
          dimensione: 50,
          disponibile: true
        },
        {
          _id: '507f1f77bcf86cd799439012',
          numero: 2,
          dimensione: 75,
          disponibile: false
        }
      ];

      Lotto.find.mockResolvedValue(mockLotti);

      const response = await request(app)
        .get('/api/v1/lotti')
        .expect(200);

      expect(Lotto.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockLotti);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      Lotto.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/lotti')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nel recupero dei lotti');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/lotti', () => {
    test('should create a new lotto and return it with status 201', async () => {
      const mockLottoData = {
        numero: 3,
        dimensione: 60,
        disponibile: true
      };

      const mockSavedLotto = {
        _id: '507f1f77bcf86cd799439013',
        ...mockLottoData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedLotto);
      Lotto.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/lotti')
        .send(mockLottoData)
        .expect(201);

      expect(Lotto).toHaveBeenCalledWith(mockLottoData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockSavedLotto);
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Validation failed');

      Lotto.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/lotti')
        .send({ numero: 1 })
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nella creazione del lotto');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/lotti/:id', () => {
    test('should return lotto by ID with status 200', async () => {
      const mockLotto = {
        _id: '507f1f77bcf86cd799439011',
        numero: 1,
        dimensione: 50,
        disponibile: true
      };

      Lotto.findById.mockResolvedValue(mockLotto);

      const response = await request(app)
        .get('/api/v1/lotti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Lotto.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockLotto);
    });

    test('should return 404 when lotto not found', async () => {
      Lotto.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/lotti/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Lotto non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      Lotto.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/lotti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nel recupero del lotto');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/lotti/:id', () => {
    test('should update lotto and return it with status 200', async () => {
      const mockUpdatedLotto = {
        _id: '507f1f77bcf86cd799439011',
        numero: 1,
        dimensione: 80,
        disponibile: false
      };

      const updateData = { dimensione: 80, disponibile: false };
      Lotto.findByIdAndUpdate.mockResolvedValue(mockUpdatedLotto);

      const response = await request(app)
        .put('/api/v1/lotti/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(200);

      expect(Lotto.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true }
      );
      expect(response.body).toEqual(mockUpdatedLotto);
    });

    test('should return 404 when lotto not found', async () => {
      Lotto.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/lotti/507f1f77bcf86cd799439011')
        .send({ dimensione: 80 })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Lotto non trovato');
    });

    test('should return error 500 when update fails', async () => {
      const mockError = new Error('Database error');
      Lotto.findByIdAndUpdate.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/lotti/507f1f77bcf86cd799439011')
        .send({ dimensione: 80 })
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nell\'aggiornamento del lotto');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/lotti/:id', () => {
    test('should delete lotto and return success message with status 200', async () => {
      const mockDeletedLotto = {
        _id: '507f1f77bcf86cd799439011',
        numero: 1
      };

      Lotto.findByIdAndDelete.mockResolvedValue(mockDeletedLotto);

      const response = await request(app)
        .delete('/api/v1/lotti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Lotto.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toHaveProperty('message', 'Lotto eliminato con successo');
    });

    test('should return 404 when lotto not found', async () => {
      Lotto.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/lotti/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Lotto non trovato');
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Database error');
      Lotto.findByIdAndDelete.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/lotti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nell\'eliminazione del lotto');
      expect(response.body).toHaveProperty('error');
    });
  });
});
