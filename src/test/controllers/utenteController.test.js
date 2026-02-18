const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Utente = require('../../model/user/utente');
const bcrypt = require('bcrypt');

// Mock del model Utente e bcrypt
jest.mock('../../model/user/utente');
jest.mock('bcrypt');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.user = { id: 'testUserId', email: 'test@test.com' };
  next();
});

describe('UtenteController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });

  describe('GET /api/v1/utenti', () => {
    test('should return all utenti without passwords with status 200', async () => {
      const mockUtenti = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario@test.com',
          tipo: 'citt'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          nome: 'Luigi',
          cognome: 'Verdi',
          email: 'luigi@test.com',
          tipo: 'citt'
        }
      ];

      const selectMock = jest.fn().mockResolvedValue(mockUtenti);
      Utente.find.mockReturnValue({
        select: selectMock
      });

      const response = await request(app)
        .get('/api/v1/utenti')
        .expect(200);

      expect(Utente.find).toHaveBeenCalledTimes(1);
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(response.body).toEqual(mockUtenti);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      Utente.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(mockError)
      });

      const response = await request(app)
        .get('/api/v1/utenti')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero degli utenti');
    });
  });

  describe('GET /api/v1/utenti/:id', () => {
    test('should return utente by ID without password with status 200', async () => {
      const mockUtente = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario@test.com',
        tipo: 'citt'
      };

      const selectMock = jest.fn().mockResolvedValue(mockUtente);
      Utente.findById.mockReturnValue({
        select: selectMock
      });

      const response = await request(app)
        .get('/api/v1/utenti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Utente.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(response.body).toEqual(mockUtente);
    });

    test('should return 404 when utente not found', async () => {
      Utente.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .get('/api/v1/utenti/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.message).toBe('Utente non trovato');
    });

    test('should return error 500 when retrieval fails', async () => {
      const mockError = new Error('Database error');

      Utente.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(mockError)
      });

      const response = await request(app)
        .get('/api/v1/utenti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe("Errore nel recupero dell'utente");
    });
  });

  describe('POST /api/v1/utenti', () => {
    test('should create a new cittadino utente and return it with status 201', async () => {
      const mockUtenteData = {
        nome: 'Mario',
        cognome: 'Rossi',
        codicefiscale: 'RSSMRA80A01H501U',
        email: 'mario@test.com',
        password: 'password123',
        indirizzo: 'Via Test 1',
        telefono: '1234567890',
        tipo: 'citt'
      };

      const mockSavedUtente = {
        _id: '507f1f77bcf86cd799439013',
        ...mockUtenteData,
        password: 'hashedPassword',
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439013',
          ...mockUtenteData,
          password: 'hashedPassword'
        })
      };

      Utente.findOne.mockResolvedValue(null); // Email non esiste
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const saveMock = jest.fn().mockResolvedValue(mockSavedUtente);
      Utente.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/utenti')
        .send(mockUtenteData)
        .expect(201);

      expect(Utente.findOne).toHaveBeenCalledWith({ email: 'mario@test.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Utente creato con successo');
      expect(response.body.utente).toMatchObject({
        nome: 'Mario',
        email: 'mario@test.com'
      });
    });

    test('should return 409 when email already exists', async () => {
      Utente.findOne.mockResolvedValue({ email: 'mario@test.com' });

      const response = await request(app)
        .post('/api/v1/utenti')
        .send({
          nome: 'Mario',
          email: 'mario@test.com',
          password: 'password123'
        })
        .expect(409);

      expect(response.body.message).toBe('Utente già esistente con questa email');
    });

    test('should return 400 when associazione is missing for tipo asso', async () => {
      Utente.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const response = await request(app)
        .post('/api/v1/utenti')
        .send({
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario@test.com',
          password: 'password123',
          tipo: 'asso'
        })
        .expect(400);

      expect(response.body.message).toBe("Il campo 'associazione' è obbligatorio per il tipo 'asso'");
    });

    test('should return 400 when comune is missing for tipo comu', async () => {
      Utente.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const response = await request(app)
        .post('/api/v1/utenti')
        .send({
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario@test.com',
          password: 'password123',
          tipo: 'comu'
        })
        .expect(400);

      expect(response.body.message).toBe("Il campo 'comune' è obbligatorio per il tipo 'comu'");
    });

    test('should return error 400 for validation error', async () => {
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';
      mockError.errors = {
        email: { message: 'Invalid email format' }
      };

      Utente.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      Utente.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/utenti')
        .send({
          nome: 'Mario',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toBe("Errore di validazione");
      expect(response.body.errors).toEqual(['Invalid email format']);
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Database error');

      Utente.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      Utente.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/utenti')
        .send({
          nome: 'Mario',
          email: 'mario@test.com',
          password: 'password123'
        })
        .expect(500);

      expect(response.body.message).toBe("Errore nella creazione dell'utente");
    });
  });

  describe('PUT /api/v1/utenti/:id', () => {
    test('should update utente and return it with status 200', async () => {
      const mockUpdatedUtente = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.nuovo@test.com',
        tipo: 'citt'
      };

      const selectMock = jest.fn().mockResolvedValue(mockUpdatedUtente);
      Utente.findByIdAndUpdate.mockReturnValue({
        select: selectMock
      });

      const response = await request(app)
        .put('/api/v1/utenti/507f1f77bcf86cd799439011')
        .send({ email: 'mario.nuovo@test.com' })
        .expect(200);

      expect(Utente.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { email: 'mario.nuovo@test.com' },
        { new: true, runValidators: true }
      );
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(response.body.message).toBe('Utente aggiornato con successo');
      expect(response.body.utente).toMatchObject(mockUpdatedUtente);
    });

    test('should return 404 when utente not found', async () => {
      Utente.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .put('/api/v1/utenti/507f1f77bcf86cd799439011')
        .send({ email: 'test@test.com' })
        .expect(404);

      expect(response.body.message).toBe('Utente non trovato');
    });

    test('should return error 400 for validation error', async () => {
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';
      mockError.errors = {
        email: { message: 'Invalid email format' }
      };

      Utente.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockRejectedValue(mockError)
      });

      const response = await request(app)
        .put('/api/v1/utenti/507f1f77bcf86cd799439011')
        .send({ email: 'invalid' })
        .expect(400);

      expect(response.body.message).toBe("Errore di validazione");
      expect(response.body.errors).toEqual(['Invalid email format']);
    });
  });

  describe('DELETE /api/v1/utenti/:id', () => {
    test('should delete utente and return success message with status 200', async () => {
      const mockUtente = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Mario',
        email: 'mario@test.com',
        password: 'hashedPassword'
      };

      Utente.findById.mockResolvedValue(mockUtente);
      bcrypt.compare.mockResolvedValue(true);
      Utente.findByIdAndDelete.mockResolvedValue(mockUtente);

      const response = await request(app)
        .delete('/api/v1/utenti/507f1f77bcf86cd799439011')
        .send({ password: 'password123' })
        .expect(200);

      expect(Utente.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(Utente.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body.message).toBe('Utente eliminato con successo');
    });

    test('should return 404 when utente not found', async () => {
      Utente.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/utenti/507f1f77bcf86cd799439011')
        .send({ password: 'password123' })
        .expect(404);

      expect(response.body.message).toBe('Utente non trovato');
    });

    test('should return 401 when password is incorrect', async () => {
      const mockUtente = {
        _id: '507f1f77bcf86cd799439011',
        password: 'hashedPassword'
      };

      Utente.findById.mockResolvedValue(mockUtente);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/v1/utenti/507f1f77bcf86cd799439011')
        .send({ password: 'wrongPassword' })
        .expect(401);

      expect(response.body.message).toBe('Errore di autenticazione');
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Database error');
      Utente.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/utenti/507f1f77bcf86cd799439011')
        .send({ password: 'password123' })
        .expect(500);

      expect(response.body.message).toBe("Errore nell'eliminazione dell'utente");
    });
  });

  describe('PUT /api/v1/utenti/:id/password', () => {
    test('should update password and return success message with status 200', async () => {
      const mockUtente = {
        _id: '507f1f77bcf86cd799439011',
        email: 'mario@test.com',
        password: 'oldHashedPassword',
        save: jest.fn().mockResolvedValue(true)
      };

      Utente.findById.mockResolvedValue(mockUtente);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newHashedPassword');

      const response = await request(app)
        .put('/api/v1/utenti/updatePassword/507f1f77bcf86cd799439011')
        .send({
          oldPassword: 'oldPassword',
          newPassword: 'newPassword123'
        })
        .expect(200);

      expect(Utente.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword', 'oldHashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(mockUtente.password).toBe('newHashedPassword');
      expect(mockUtente.save).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Password aggiornata con successo');
    });

    test('should return 404 when utente not found', async () => {
      Utente.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/utenti/updatePassword/507f1f77bcf86cd799439011')
        .send({
          oldPassword: 'oldPassword',
          newPassword: 'newPassword123'
        })
        .expect(404);

      expect(response.body.message).toBe('Utente non trovato');
    });

    test('should return 401 when old password is incorrect', async () => {
      const mockUtente = {
        _id: '507f1f77bcf86cd799439011',
        password: 'oldHashedPassword'
      };

      Utente.findById.mockResolvedValue(mockUtente);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .put('/api/v1/utenti/updatePassword/507f1f77bcf86cd799439011')
        .send({
          oldPassword: 'wrongPassword',
          newPassword: 'newPassword123'
        })
        .expect(401);

      expect(response.body.message).toBe('Vecchia password non corretta');
    });

    test('should return error 500 when password update fails', async () => {
      const mockError = new Error('Database error');
      Utente.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/utenti/updatePassword/507f1f77bcf86cd799439011')
        .send({
          oldPassword: 'oldPassword',
          newPassword: 'newPassword123'
        })
        .expect(500);

      expect(response.body.message).toBe("Errore nell'aggiornamento della password");
    });
  });
});


