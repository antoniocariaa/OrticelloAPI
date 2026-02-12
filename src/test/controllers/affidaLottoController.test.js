const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const AffidaLotto = require('../../model/assignment/affidaLotto');

// Mock del model AffidaLotto
jest.mock('../../model/assignment/affidaLotto');

// Mock del middleware di autenticazione
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.loggedUser = { id: 'testUserId', email: 'test@test.com', ruolo: 'comu' };
  next();
});

// Mock del middleware di autorizzazione
jest.mock('../../util/checkRole', () => (roles) => (req, res, next) => {
  next();
});

describe('AffidaLottoController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/affidaLotti', () => {
    test('should return all affida lotti with status 200', async () => {
      const mockAffidamenti = [
        {
          _id: '507f1f77bcf86cd799439011',
          lotto: '507f1f77bcf86cd799439021',
          utente: '507f1f77bcf86cd799439031',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2024-12-31T00:00:00.000Z'
        }
      ];

      const populateMock = jest.fn().mockResolvedValue(mockAffidamenti);
      AffidaLotto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: populateMock
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaLotti')
        .expect(200);

      expect(AffidaLotto.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockAffidamenti);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      AffidaLotto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(mockError)
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaLotti')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nel recupero degli affidamenti');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/affidaLotti/attivi', () => {
    test('should return active affida lotti with status 200', async () => {
      const mockAffidamenti = [
        {
          _id: '507f1f77bcf86cd799439011',
          lotto: '507f1f77bcf86cd799439021',
          utente: '507f1f77bcf86cd799439031',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2025-12-31T00:00:00.000Z'
        }
      ];

      const sortMock = jest.fn().mockResolvedValue(mockAffidamenti);
      AffidaLotto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: sortMock
          })
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaLotti/attivi')
        .expect(200);

      expect(AffidaLotto.find).toHaveBeenCalledWith(
        expect.objectContaining({
          data_inizio: expect.any(Object),
          data_fine: expect.any(Object)
        })
      );
      expect(response.body).toEqual(mockAffidamenti);
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      AffidaLotto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockRejectedValue(mockError)
          })
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaLotti/attivi')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nel recupero affidamenti attivi');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/affidaLotti', () => {
    test('should create a new affida lotto and return it with status 201', async () => {
      const mockAffidamentoData = {
        lotto: '507f1f77bcf86cd799439021',
        utente: '507f1f77bcf86cd799439031',
        data_inizio: '2024-01-01T00:00:00.000Z',
        data_fine: '2024-12-31T00:00:00.000Z'
      };

      const mockSavedAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        ...mockAffidamentoData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedAffidamento);
      AffidaLotto.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/affidaLotti')
        .send(mockAffidamentoData)
        .expect(201);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Richiesta inviata con successo');
      expect(response.body).toHaveProperty('data', mockSavedAffidamento);
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Validation failed');

      AffidaLotto.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/affidaLotti')
        .send({ lotto: '507f1f77bcf86cd799439021' })
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore durante la creazione della richiesta');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/affidaLotti/:id', () => {
    test('should return affida lotto by ID with status 200', async () => {
      const mockAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        lotto: '507f1f77bcf86cd799439021',
        utente: '507f1f77bcf86cd799439031'
      };

      const populateMock = jest.fn().mockResolvedValue(mockAffidamento);
      AffidaLotto.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: populateMock
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaLotti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(AffidaLotto.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockAffidamento);
    });

    test('should return 404 when affida lotto not found', async () => {
      AffidaLotto.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaLotti/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Affidamento non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');

      AffidaLotto.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(mockError)
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaLotti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nel recupero dettaglio');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/affidaLotti/:id', () => {
    test('should update affida lotto and return it with status 200', async () => {
      const mockUpdatedAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        lotto: '507f1f77bcf86cd799439021',
        utente: '507f1f77bcf86cd799439031',
        data_fine: '2025-12-31T00:00:00.000Z'
      };

      const updateData = { data_fine: '2025-12-31T00:00:00.000Z' };
      AffidaLotto.findByIdAndUpdate.mockResolvedValue(mockUpdatedAffidamento);

      const response = await request(app)
        .put('/api/v1/affidaLotti/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(200);

      expect(AffidaLotto.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true }
      );
      expect(response.body).toHaveProperty('message', 'Aggiornato con successo');
      expect(response.body).toHaveProperty('data', mockUpdatedAffidamento);
    });

    test('should return 404 when affida lotto not found', async () => {
      AffidaLotto.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/affidaLotti/507f1f77bcf86cd799439011')
        .send({ data_fine: '2025-12-31T00:00:00.000Z' })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Non trovato');
    });
  });

  describe('DELETE /api/v1/affidaLotti/:id', () => {
    test('should delete affida lotto and return success message with status 200', async () => {
      const mockDeletedAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        lotto: '507f1f77bcf86cd799439021'
      };

      AffidaLotto.findByIdAndDelete.mockResolvedValue(mockDeletedAffidamento);

      const response = await request(app)
        .delete('/api/v1/affidaLotti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(AffidaLotto.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toHaveProperty('message', 'Eliminato con successo');
    });

    test('should return 404 when affida lotto not found', async () => {
      AffidaLotto.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/affidaLotti/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Non trovato');
    });
  });
});

