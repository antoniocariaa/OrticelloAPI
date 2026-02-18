const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Associazione = require('../../model/organization/associazione');
const Utente = require('../../model/user/utente');
const AffidaOrto = require('../../model/assignment/affidaOrto');
const AffidaLotto = require('../../model/assignment/affidaLotto');
const Orto = require('../../model/garden/orto');

// Mock del model Associazione
jest.mock('../../model/organization/associazione');
jest.mock('../../model/user/utente');
jest.mock('../../model/assignment/affidaOrto');
jest.mock('../../model/assignment/affidaLotto');
jest.mock('../../model/garden/orto');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.loggedUser = { id: 'testUserId', email: 'test@test.com', tipo: 'comu', admin: false };
  next();
});

// Mock checkRole middleware per bypassare controllo ruoli nei test
jest.mock('../../util/checkRole', () => () => (req, res, next) => {
  next();
});

describe('AssociazioneController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  }, 10000);

  describe('GET /api/v1/associazioni', () => {
    test('should return all associazioni with status 200', async () => {
      const mockAssociazioni = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Associazione Verde',
          email: 'verde@test.com',
          telefono: '1234567890'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          nome: 'Associazione Blu',
          email: 'blu@test.com',
          telefono: '0987654321'
        }
      ];

      Associazione.find.mockResolvedValue(mockAssociazioni);

      const response = await request(app)
        .get('/api/v1/associazioni')
        .expect(200);

      expect(Associazione.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockAssociazioni);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      Associazione.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/associazioni')
        .expect(500);

      expect(Associazione.find).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Errore nel recupero delle associazioni');
    });
  });

  describe('GET /api/v1/associazioni/:id', () => {
    test('should return associazione by ID with status 200', async () => {
      const mockAssociazione = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Associazione Verde',
        email: 'verde@test.com'
      };

      Associazione.findById.mockResolvedValue(mockAssociazione);

      const response = await request(app)
        .get('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Associazione.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockAssociazione);
    });

    test('should return 404 when associazione not found', async () => {
      Associazione.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Associazione non trovata');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');
      Associazione.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe("Errore nel recupero dell'associazione");
    });
  });

  describe('POST /api/v1/associazioni', () => {
    test('should create a new associazione and return it with status 201', async () => {
      const mockAssociazioneData = {
        nome: 'Associazione Nuova',
        email: 'nuova@test.com',
        telefono: '1111111111'
      };

      const mockSavedAssociazione = {
        _id: '507f1f77bcf86cd799439013',
        ...mockAssociazioneData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedAssociazione);
      Associazione.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/associazioni')
        .send(mockAssociazioneData)
        .expect(201);

      expect(Associazione).toHaveBeenCalledWith(mockAssociazioneData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Associazione creata con successo');
      expect(response.body.data).toMatchObject(mockSavedAssociazione);
    });

    test('should return error 400 for validation error', async () => {
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';

      Associazione.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/associazioni')
        .send({ nome: 'Test' })
        .expect(400);

      expect(response.body.message).toBe('Dati non validi o duplicati');
    });

    test('should return error 400 for duplicate key error', async () => {
      const mockError = new Error('Duplicate key');
      mockError.code = 11000;

      Associazione.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/associazioni')
        .send({ nome: 'Test', email: 'test@test.com' })
        .expect(400);

      expect(response.body.message).toBe('Dati non validi o duplicati');
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Database error');

      Associazione.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/associazioni')
        .send({ nome: 'Test' })
        .expect(500);

      expect(response.body.message).toBe("Errore nella creazione dell'associazione");
    });
  });

  describe('PUT /api/v1/associazioni/:id', () => {
    test('should update associazione and return it with status 200', async () => {
      const mockUpdatedAssociazione = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Associazione Aggiornata',
        email: 'aggiornata@test.com'
      };

      Associazione.findByIdAndUpdate.mockResolvedValue(mockUpdatedAssociazione);

      const response = await request(app)
        .put('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .send({ nome: 'Associazione Aggiornata' })
        .expect(200);

      expect(Associazione.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { nome: 'Associazione Aggiornata' },
        { new: true, runValidators: true }
      );
      expect(response.body.message).toBe('Associazione aggiornata con successo');
      expect(response.body.data).toMatchObject(mockUpdatedAssociazione);
    });

    test('should return 404 when associazione not found', async () => {
      Associazione.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .send({ nome: 'Test' })
        .expect(404);

      expect(response.body.message).toBe('Associazione non trovata');
    });

    test('should return error 400 for validation error', async () => {
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';

      Associazione.findByIdAndUpdate.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .send({ nome: 'Test' })
        .expect(400);

      expect(response.body.message).toBe('Dati non validi o duplicati');
    });
  });

  describe('DELETE /api/v1/associazioni/:id', () => {
    test('should delete associazione and return success message with status 200', async () => {
      const mockDeletedAssociazione = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Associazione Eliminata'
      };

      // Mock all dependencies for deleteAssociazione
      Associazione.findById.mockResolvedValue(mockDeletedAssociazione);
      Utente.updateMany.mockResolvedValue({ modifiedCount: 2 });
      AffidaOrto.find.mockResolvedValue([]);
      AffidaOrto.deleteMany.mockResolvedValue({ deletedCount: 0 });
      Associazione.findByIdAndDelete.mockResolvedValue(mockDeletedAssociazione);

      const response = await request(app)
        .delete('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Associazione.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(Associazione.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body.message).toBe('Associazione eliminata con successo');
    });

    test('should return 404 when associazione not found', async () => {
      Associazione.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Associazione non trovata');
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Database error');
      Associazione.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/associazioni/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe("Errore nell'eliminazione dell'associazione");
    });
  });
});
