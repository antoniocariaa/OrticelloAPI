const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const AffidaOrto = require('../../model/affidaOrto');

// Mock del model AffidaOrto
jest.mock('../../model/affidaOrto');

// Mock del middleware di autenticazione
jest.mock('../../util/checkToken', () => (_req, _res, next) => {
  next();
});

describe('AffidaOrtoController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/affidaOrti', () => {
    test('should return all affida orti with status 200', async () => {
      const mockAffidamenti = [
        {
          _id: '507f1f77bcf86cd799439011',
          orto: '507f1f77bcf86cd799439021',
          associazione: '507f1f77bcf86cd799439031',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2024-12-31T00:00:00.000Z'
        }
      ];

      const populateMock = jest.fn().mockResolvedValue(mockAffidamenti);
      AffidaOrto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: populateMock
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaOrti')
        .expect(200);

      expect(AffidaOrto.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockAffidamenti);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      AffidaOrto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(mockError)
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaOrti')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Errore nel recupero degli affidamenti degli orti');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/affidaOrti/active', () => {
    test('should return active affida orti with status 200', async () => {
      const mockAffidamenti = [
        {
          _id: '507f1f77bcf86cd799439011',
          orto: '507f1f77bcf86cd799439021',
          associazione: '507f1f77bcf86cd799439031',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2025-12-31T00:00:00.000Z'
        }
      ];

      // Mock the chained populate calls - need to chain properly
      const populateMock = jest.fn().mockResolvedValue(mockAffidamenti);
      AffidaOrto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: populateMock
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaOrti/active')
        .expect(200);

      expect(AffidaOrto.find).toHaveBeenCalledWith(
        expect.objectContaining({
          data_inizio: expect.any(Object),
          data_fine: expect.any(Object)
        })
      );
      expect(response.body).toEqual(mockAffidamenti);
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      AffidaOrto.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(mockError)
        })
      });

      await request(app)
        .get('/api/v1/affidaOrti/active')
        .expect(500);
    });
  });

  describe('POST /api/v1/affidaOrti', () => {
    test('should create a new affida orto and return it with status 201', async () => {
      const mockAffidamentoData = {
        orto: '507f1f77bcf86cd799439021',
        associazione: '507f1f77bcf86cd799439031',
        data_inizio: '2024-01-01T00:00:00.000Z',
        data_fine: '2024-12-31T00:00:00.000Z'
      };

      const mockSavedAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        ...mockAffidamentoData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedAffidamento);
      AffidaOrto.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/affidaOrti')
        .send(mockAffidamentoData)
        .expect(201);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', "Affidamento dell'orto creato con successo");
      expect(response.body).toHaveProperty('data', mockSavedAffidamento);
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Validation failed');

      AffidaOrto.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/affidaOrti')
        .send({ orto: '507f1f77bcf86cd799439021' })
        .expect(500);

      expect(response.body).toHaveProperty('message', "Errore nella creazione dell'affidamento dell'orto");
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/affidaOrti/:id', () => {
    test('should return affida orto by ID with status 200', async () => {
      const mockAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        orto: '507f1f77bcf86cd799439021',
        associazione: '507f1f77bcf86cd799439031'
      };

      const populateMock = jest.fn().mockResolvedValue(mockAffidamento);
      AffidaOrto.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: populateMock
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(AffidaOrto.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockAffidamento);
    });

    test('should return 404 when affida orto not found', async () => {
      AffidaOrto.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('message', "Affidamento dell'orto non trovato");
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');

      AffidaOrto.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(mockError)
        })
      });

      const response = await request(app)
        .get('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body).toHaveProperty('message', "Errore nel recupero dell'affidamento dell'orto");
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/affidaOrti/:id', () => {
    test('should update affida orto and return it with status 200', async () => {
      const mockUpdatedAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        orto: '507f1f77bcf86cd799439021',
        associazione: '507f1f77bcf86cd799439031',
        data_fine: '2025-12-31T00:00:00.000Z'
      };

      const updateData = { data_fine: '2025-12-31T00:00:00.000Z' };
      AffidaOrto.findByIdAndUpdate.mockResolvedValue(mockUpdatedAffidamento);

      const response = await request(app)
        .put('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(200);

      expect(AffidaOrto.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true }
      );
      expect(response.body).toHaveProperty('message', "Affidamento dell'orto aggiornato con successo");
      expect(response.body).toHaveProperty('data', mockUpdatedAffidamento);
    });

    test('should return 404 when affida orto not found', async () => {
      AffidaOrto.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .send({ data_fine: '2025-12-31T00:00:00.000Z' })
        .expect(404);

      expect(response.body).toHaveProperty('message', "Affidamento dell'orto non trovato");
    });

    test('should return 500 when update fails', async () => {
      const mockError = new Error('Database error');
      AffidaOrto.findByIdAndUpdate.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .send({ data_fine: '2025-12-31T00:00:00.000Z' })
        .expect(500);

      expect(response.body).toHaveProperty('message', "Errore nell'aggiornamento dell'affidamento dell'orto");
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/affidaOrti/:id', () => {
    test('should delete affida orto and return success message with status 200', async () => {
      const mockDeletedAffidamento = {
        _id: '507f1f77bcf86cd799439011',
        orto: '507f1f77bcf86cd799439021'
      };

      AffidaOrto.findByIdAndDelete.mockResolvedValue(mockDeletedAffidamento);

      const response = await request(app)
        .delete('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(AffidaOrto.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toHaveProperty('message', "Affidamento dell'orto eliminato con successo");
    });

    test('should return 404 when affida orto not found', async () => {
      AffidaOrto.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('message', "Affidamento dell'orto non trovato");
    });

    test('should return 500 when deletion fails', async () => {
      const mockError = new Error('Database error');
      AffidaOrto.findByIdAndDelete.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/affidaOrti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body).toHaveProperty('message', "Errore nell'eliminazione dell'affidamento dell'orto");
      expect(response.body).toHaveProperty('error');
    });
  });
});