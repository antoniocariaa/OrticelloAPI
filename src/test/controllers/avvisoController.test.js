const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Avviso = require('../../model/news/avviso');
const AvvisoLetto = require('../../model/news/avvisoLetto');

// Mock del model avviso e avvisoLetto
jest.mock('../../model/news/avviso');
jest.mock('../../model/news/avvisoLetto');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.user = { id: 'testUserId', email: 'test@test.com' };
  req.loggedUser = { id: 'testUserId', email: 'test@test.com', tipo: 'comu', admin: true };
  next();
});

// Mock del middleware di autorizzazione
jest.mock('../../util/checkRole', () => (roles, requireAdmin) => (req, res, next) => {
  next();
});

describe('AvvisoController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/avvisi', () => {
    test('should return all avvisi with status 200', async () => {
      const mockAvvisi = [
        {
          _id: '507f1f77bcf86cd799439011',
          titolo: 'Avviso Importante',
          contenuto: 'Contenuto del primo avviso',
          data_pubblicazione: '2024-01-01T00:00:00.000Z'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          titolo: 'Secondo Avviso',
          contenuto: 'Contenuto del secondo avviso',
          data_pubblicazione: '2024-01-02T00:00:00.000Z'
        }
      ];

      Avviso.find.mockResolvedValue(mockAvvisi);

      const response = await request(app)
        .get('/api/v1/avvisi')
        .expect(200);

      expect(Avviso.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockAvvisi);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      Avviso.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/avvisi')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero degli avvisi');
    });
  });

  describe('POST /api/v1/avvisi', () => {
    test('should create a new avviso and return it with status 201', async () => {
      const mockAvvisoData = {
        titolo: 'Nuovo Avviso',
        contenuto: 'Contenuto del nuovo avviso',
        data_pubblicazione: '2024-01-15T00:00:00.000Z'
      };

      const mockSavedAvviso = {
        _id: '507f1f77bcf86cd799439013',
        ...mockAvvisoData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedAvviso);
      Avviso.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/avvisi')
        .send(mockAvvisoData)
        .expect(201);

      expect(Avviso).toHaveBeenCalledWith(mockAvvisoData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Avviso creato con successo');
      expect(response.body.data).toMatchObject(mockSavedAvviso);
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Validation failed');

      Avviso.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/avvisi')
        .send({ titolo: 'Test' })
        .expect(500);

      expect(response.body.message).toBe('Errore nella creazione dell\'avviso');
    });
  });

  describe('GET /api/v1/avvisi/:id', () => {
    test('should return avviso by ID with status 200', async () => {
      const mockAvviso = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Avviso Test',
        contenuto: 'Contenuto test'
      };

      Avviso.findById.mockResolvedValue(mockAvviso);

      const response = await request(app)
        .get('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Avviso.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockAvviso);
    });

    test('should return 404 when avviso not found', async () => {
      Avviso.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Avviso non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      Avviso.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero dell\'avviso');
    });
  });

  describe('PUT /api/v1/avvisi/:id', () => {
    test('should update avviso and return it with status 200', async () => {
      const mockUpdatedAvviso = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Avviso Aggiornato',
        contenuto: 'Contenuto aggiornato'
      };

      Avviso.findByIdAndUpdate.mockResolvedValue(mockUpdatedAvviso);

      const response = await request(app)
        .put('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .send({ titolo: 'Avviso Aggiornato' })
        .expect(200);

      expect(Avviso.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { titolo: 'Avviso Aggiornato' },
        { new: true }
      );
      expect(response.body.message).toBe('Avviso aggiornato con successo');
      expect(response.body.data).toMatchObject(mockUpdatedAvviso);
    });

    test('should return 404 when avviso not found', async () => {
      Avviso.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .send({ titolo: 'Test' })
        .expect(404);

      expect(response.body.message).toBe('Avviso non trovato');
    });

    test('should return error 500 when update fails', async () => {
      const mockError = new Error('Database error');
      Avviso.findByIdAndUpdate.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .send({ titolo: 'Test' })
        .expect(500);

      expect(response.body.message).toBe('Errore nell\'aggiornamento dell\'avviso');
    });
  });

  describe('DELETE /api/v1/avvisi/:id', () => {
    test('should delete avviso and return success message with status 200', async () => {
      const mockDeletedAvviso = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Avviso Eliminato'
      };

      Avviso.findByIdAndDelete.mockResolvedValue(mockDeletedAvviso);

      const response = await request(app)
        .delete('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Avviso.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body.message).toBe('Avviso eliminato con successo');
    });

    test('should return 404 when avviso not found', async () => {
      Avviso.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Avviso non trovato');
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Database error');
      Avviso.findByIdAndDelete.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/avvisi/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nell\'eliminazione dell\'avviso');
    });
  });

  describe('GET /api/v1/avvisi/filtered', () => {
    test('should return filtered avvisi with pagination', async () => {
      const mockAvvisi = [
        {
          _id: '507f1f77bcf86cd799439011',
          titolo: 'Avviso Comune',
          tipo: 'comu',
          comune: { _id: 'comune1', nome: 'Milano' },
          messaggio: 'Messaggio importante',
          data: '2024-01-15T00:00:00.000Z',
          categoria: 'generale'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          titolo: 'Avviso Associazione',
          tipo: 'asso',
          associazione: { _id: 'asso1', nome: 'Associazione Verde' },
          messaggio: 'Evento in programma',
          data: '2024-01-20T00:00:00.000Z',
          categoria: 'eventi'
        }
      ];

      // Create a proper query chain mock
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve(mockAvvisi))
      };
      
      Avviso.find.mockReturnValue(mockQueryChain);
      Avviso.countDocuments.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/v1/avvisi/filtered')
        .query({ tipo: 'comu', page: 1, limit: 20 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalItems).toBe(2);
    });

    test('should filter by date range', async () => {
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve([]))
      };
      
      Avviso.find.mockReturnValue(mockQueryChain);
      Avviso.countDocuments.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/v1/avvisi/filtered')
        .query({ 
          dataInizio: '2024-01-01', 
          dataFine: '2024-01-31' 
        })
        .expect(200);

      expect(Avviso.find).toHaveBeenCalled();
      const filterArg = Avviso.find.mock.calls[0][0];
      expect(filterArg.data).toBeDefined();
      expect(filterArg.data.$gte).toBeDefined();
      expect(filterArg.data.$lte).toBeDefined();
    });

    test('should filter by categoria', async () => {
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve([]))
      };
      
      Avviso.find.mockReturnValue(mockQueryChain);
      Avviso.countDocuments.mockResolvedValue(0);

      await request(app)
        .get('/api/v1/avvisi/filtered')
        .query({ categoria: 'eventi' })
        .expect(200);

      expect(Avviso.find).toHaveBeenCalled();
      const filterArg = Avviso.find.mock.calls[0][0];
      expect(filterArg.categoria).toBe('eventi');
    });

    test('should filter by read status for authenticated user', async () => {
      const mockAvvisi = [
        { _id: '507f1f77bcf86cd799439011', titolo: 'Avviso 1' }
      ];

      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve(mockAvvisi))
      };
      
      Avviso.find.mockReturnValue(mockQueryChain);
      Avviso.countDocuments.mockResolvedValue(1);

      const mockAvvisiLetti = [
        { avviso: '507f1f77bcf86cd799439011' }
      ];

      AvvisoLetto.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAvvisiLetti)
      });

      const response = await request(app)
        .get('/api/v1/avvisi/filtered')
        .query({ letto: 'true' })
        .expect(200);

      expect(AvvisoLetto.find).toHaveBeenCalled();
      expect(response.body.data).toBeDefined();
    });

    test('should return error 500 on database failure', async () => {
      const mockError = new Error('Database error');
      Avviso.find.mockImplementation(() => {
        throw mockError;
      });

      const response = await request(app)
        .get('/api/v1/avvisi/filtered')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero degli avvisi');
    });
  });

  describe('PUT /api/v1/avvisi/:id/read', () => {
    test('should mark avviso as read successfully', async () => {
      const mockAvviso = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Avviso Test'
      };

      const mockAvvisoLetto = {
        _id: 'letto123',
        utente: 'testUserId',
        avviso: '507f1f77bcf86cd799439011',
        dataLettura: new Date()
      };

      Avviso.findById.mockResolvedValue(mockAvviso);
      AvvisoLetto.findOneAndUpdate.mockResolvedValue(mockAvvisoLetto);

      const response = await request(app)
        .put('/api/v1/avvisi/507f1f77bcf86cd799439011/read')
        .expect(200);

      expect(Avviso.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(AvvisoLetto.findOneAndUpdate).toHaveBeenCalled();
      expect(response.body.data.avvisoId).toBe('507f1f77bcf86cd799439011');
    });

    test('should return 404 when avviso not found', async () => {
      Avviso.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/avvisi/507f1f77bcf86cd799439011/read')
        .expect(404);

      expect(response.body.message).toBe('Avviso non trovato');
    });

    test('should handle duplicate key error gracefully', async () => {
      const mockAvviso = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Avviso Test'
      };

      const duplicateError = new Error('Duplicate key');
      duplicateError.code = 11000;

      Avviso.findById.mockResolvedValue(mockAvviso);
      AvvisoLetto.findOneAndUpdate.mockRejectedValue(duplicateError);

      const response = await request(app)
        .put('/api/v1/avvisi/507f1f77bcf86cd799439011/read')
        .expect(200);

      expect(response.body.message).toBe('success.avviso_already_read');
    });

    test('should return error 500 on database failure', async () => {
      const mockAvviso = {
        _id: '507f1f77bcf86cd799439011',
        titolo: 'Avviso Test'
      };

      const mockError = new Error('Database error');

      Avviso.findById.mockResolvedValue(mockAvviso);
      AvvisoLetto.findOneAndUpdate.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/avvisi/507f1f77bcf86cd799439011/read')
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/avvisi/read-status', () => {
    test('should return read status for multiple avvisi', async () => {
      const avvisiIds = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'];
      
      const mockAvvisiLetti = [
        { 
          avviso: '507f1f77bcf86cd799439011',
          dataLettura: new Date('2024-01-15')
        }
      ];

      AvvisoLetto.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAvvisiLetti)
      });

      const response = await request(app)
        .post('/api/v1/avvisi/read-status')
        .send({ avvisiIds })
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data['507f1f77bcf86cd799439011'].letto).toBe(true);
      expect(response.body.data['507f1f77bcf86cd799439012'].letto).toBe(false);
    });

    test('should return 400 when avvisiIds is missing', async () => {
      const response = await request(app)
        .post('/api/v1/avvisi/read-status')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('errors.invalid_input');
    });

    test('should return 400 when avvisiIds is not an array', async () => {
      const response = await request(app)
        .post('/api/v1/avvisi/read-status')
        .send({ avvisiIds: 'not-an-array' })
        .expect(400);

      expect(response.body.message).toBe('errors.invalid_input');
    });

    test('should return error 500 on database failure', async () => {
      const mockError = new Error('Database error');
      
      AvvisoLetto.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(mockError)
      });

      const response = await request(app)
        .post('/api/v1/avvisi/read-status')
        .send({ avvisiIds: ['507f1f77bcf86cd799439011'] })
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });
});
