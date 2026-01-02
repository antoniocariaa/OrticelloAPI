const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const bando = require('../../model/news/bando');

// Mock del model bando
jest.mock('../../model/news/bando');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.user = { id: 'testUserId', email: 'test@test.com' };
  next();
});

// Mock checkRole middleware
jest.mock('../../util/checkRole', () => (roles) => (req, res, next) => {
  req.loggedUser = { id: 'testUserId', email: 'test@test.com', tipo: 'comu', admin: false };
  next();
});

describe('BandoController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/bandi', () => {
    test('should return all bandi with status 200', async () => {
      const mockBandi = [
        {
          _id: '507f1f77bcf86cd799439011',
          titolo: 'Bando Primo',
          descrizione: 'Descrizione del primo bando',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2024-12-31T00:00:00.000Z'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          titolo: 'Bando Secondo',
          descrizione: 'Descrizione del secondo bando',
          data_inizio: '2024-02-01T00:00:00.000Z',
          data_fine: '2024-11-30T00:00:00.000Z'
        }
      ];

      const sortMock = jest.fn().mockResolvedValue(mockBandi);
      bando.find.mockReturnValue({
        sort: sortMock
      });

      const response = await request(app)
        .get('/api/v1/bandi')
        .expect(200);

      expect(bando.find).toHaveBeenCalledWith({});
      expect(sortMock).toHaveBeenCalledWith({ data_fine: 1 });
      expect(response.body).toEqual(mockBandi);
    });

    test('should return only active bandi when active=true', async () => {
      const mockBandi = [
        {
          _id: '507f1f77bcf86cd799439011',
          titolo: 'Bando Attivo',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2025-12-31T00:00:00.000Z'
        }
      ];

      const sortMock = jest.fn().mockResolvedValue(mockBandi);
      bando.find.mockReturnValue({
        sort: sortMock
      });

      const response = await request(app)
        .get('/api/v1/bandi?active=true')
        .expect(200);

      expect(bando.find).toHaveBeenCalledWith(
        expect.objectContaining({
          data_fine: expect.any(Object)
        })
      );
      expect(response.body).toEqual(mockBandi);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      bando.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      const response = await request(app)
        .get('/api/v1/bandi')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero dei bandi');
    });
  });

  describe('GET /api/v1/bandi/attivi', () => {
    test('should return active bandi with status 200', async () => {
      const mockBandi = [
        {
          _id: '507f1f77bcf86cd799439011',
          titolo: 'Bando Attivo',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2025-12-31T00:00:00.000Z'
        }
      ];

      const sortMock = jest.fn().mockResolvedValue(mockBandi);
      bando.find.mockReturnValue({
        sort: sortMock
      });

      const response = await request(app)
        .get('/api/v1/bandi/attivi')
        .expect(200);

      expect(bando.find).toHaveBeenCalledWith(
        expect.objectContaining({
          data_inizio: expect.any(Object),
          data_fine: expect.any(Object)
        })
      );
      expect(response.body).toEqual(mockBandi);
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      bando.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      const response = await request(app)
        .get('/api/v1/bandi/attivi')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero dei bandi');
    });
  });

  describe('POST /api/v1/bandi', () => {
    test('should create a new bando and return it with status 201', async () => {
      const mockBandoData = {
        titolo: 'Nuovo Bando',
        descrizione: 'Descrizione del nuovo bando',
        data_inizio: '2024-01-01T00:00:00.000Z',
        data_fine: '2024-12-31T00:00:00.000Z'
      };

      const mockSavedBando = {
        _id: '507f1f77bcf86cd799439013',
        ...mockBandoData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedBando);
      bando.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/bandi')
        .send(mockBandoData)
        .expect(201);

      expect(bando).toHaveBeenCalledWith(mockBandoData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Bando creato con successo');
      expect(response.body.data).toMatchObject(mockSavedBando);
    });

    test('should return error 400 when data_fine is before data_inizio', async () => {
      const response = await request(app)
        .post('/api/v1/bandi')
        .send({
          titolo: 'Bando Test',
          data_inizio: '2024-12-31T00:00:00.000Z',
          data_fine: '2024-01-01T00:00:00.000Z'
        })
        .expect(400);

      expect(response.body.message).toBe('La data di fine deve essere successiva alla data di inizio.');
    });

    test('should return error 400 for validation error', async () => {
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';

      bando.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/bandi')
        .send({
          titolo: 'Test',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2024-12-31T00:00:00.000Z'
        })
        .expect(400);

      expect(response.body.message).toBe('errors.invalid_input');
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Database error');

      bando.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/bandi')
        .send({
          titolo: 'Test',
          data_inizio: '2024-01-01T00:00:00.000Z',
          data_fine: '2024-12-31T00:00:00.000Z'
        })
        .expect(500);

      expect(response.body.message).toBe('Errore nella creazione del bando');
    });
  });

  describe('GET /api/v1/bandi/:id', () => {
    test('should return bando by ID with status 200', async () => {
      const mockBando = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Bando Test',
        descrizione: 'Descrizione test'
      };

      bando.findById.mockResolvedValue(mockBando);

      const response = await request(app)
        .get('/api/v1/bandi/507f1f77bcf86cd799439011')
        .expect(200);

      expect(bando.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockBando);
    });

    test('should return 404 when bando not found', async () => {
      bando.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/bandi/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Bando non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      bando.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/bandi/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero del bando');
    });
  });

  describe('PUT /api/v1/bandi/:id', () => {
    test('should update bando and return it with status 200', async () => {
      const mockUpdatedBando = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Bando Aggiornato',
        descrizione: 'Descrizione aggiornata'
      };

      bando.findByIdAndUpdate.mockResolvedValue(mockUpdatedBando);

      const response = await request(app)
        .put('/api/v1/bandi/507f1f77bcf86cd799439011')
        .send({ titolo: 'Bando Aggiornato' })
        .expect(200);

      expect(bando.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { titolo: 'Bando Aggiornato' },
        { new: true, runValidators: true }
      );
      expect(response.body.message).toBe('Bando aggiornato con successo');
      expect(response.body.data).toMatchObject(mockUpdatedBando);
    });

    test('should return 404 when bando not found', async () => {
      bando.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/bandi/507f1f77bcf86cd799439011')
        .send({ titolo: 'Test' })
        .expect(404);

      expect(response.body.message).toBe('Bando non trovato');
    });
  });

  describe('DELETE /api/v1/bandi/:id', () => {
    test('should delete bando and return success message with status 200', async () => {
      const mockDeletedBando = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Bando Eliminato'
      };

      bando.findByIdAndDelete.mockResolvedValue(mockDeletedBando);

      const response = await request(app)
        .delete('/api/v1/bandi/507f1f77bcf86cd799439011')
        .expect(200);

      expect(bando.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body.message).toBe('Bando eliminato con successo');
    });

    test('should return 404 when bando not found', async () => {
      bando.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/bandi/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Bando non trovato');
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Database error');
      bando.findByIdAndDelete.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/bandi/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe("Errore nell'eliminazione del bando");
    });
  });
});

