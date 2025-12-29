const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Orto = require('../../model/orto');

// Mock del model Orto
jest.mock('../../model/orto');

// Mock JWT middleware per bypassare autenticazione nei test
jest.mock('../../util/checkToken', () => (req, res, next) => {
  req.user = { id: 'testUserId', email: 'test@test.com' };
  next();
});

describe('OrtoController', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close mongoose connection to prevent open handles
    await mongoose.connection.close();
  });


  describe('GET /api/v1/orti', () => {
    test('should return all ortos with status 200', async () => {
      const mockOrtos = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Orto San Bartolomeo',
          indirizzo: 'Via San Bartolomeo 15, Trento',
          coordinate: { lat: 46.0664, lng: 11.1257 },
          lotti: []
        },
        {
          _id: '507f1f77bcf86cd799439012',
          nome: 'Orto Gardolo',
          indirizzo: 'Via Gardolo 10, Trento',
          coordinate: { lat: 46.0800, lng: 11.1300 },
          lotti: []
        }
      ];

      Orto.find.mockResolvedValue(mockOrtos);

      const response = await request(app)
        .get('/api/v1/orti')
        .expect(200);

      expect(Orto.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockOrtos);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      Orto.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/orti')
        .expect(500);

      expect(Orto.find).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Errore nel recupero degli orti');
    });
  });

  describe('POST /api/v1/orti', () => {
    test('should create a new orto and return it with status 201', async () => {
      const mockOrtoData = {
        nome: 'Orto Nuovo',
        indirizzo: 'Via Nuova 1, Trento',
        coordinate: { lat: 46.0700, lng: 11.1200 },
        lotti: []
      };

      const mockSavedOrto = {
        _id: '507f1f77bcf86cd799439013',
        ...mockOrtoData
      };

      const saveMock = jest.fn().mockResolvedValue(mockSavedOrto);
      Orto.mockImplementation(() => ({
        save: saveMock
      }));

      const response = await request(app)
        .post('/api/v1/orti')
        .send(mockOrtoData)
        .expect(201);

      expect(Orto).toHaveBeenCalledWith(mockOrtoData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Orto creato con successo');
      expect(response.body.data).toMatchObject(mockSavedOrto);
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Validation failed');
      const mockOrtoData = {
        nome: 'Orto Test'
      };

      Orto.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .post('/api/v1/orti')
        .send(mockOrtoData)
        .expect(500);

      expect(response.body.message).toBe('Errore nella creazione dell\'orto');
    });
  });

  describe('GET /api/v1/orti/:id', () => {
    test('should return orto by id with status 200', async () => {
      const mockOrto = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Orto San Bartolomeo',
        indirizzo: 'Via San Bartolomeo 15, Trento',
        coordinate: { lat: 46.0664, lng: 11.1257 },
        lotti: []
      };

      Orto.findById.mockResolvedValue(mockOrto);

      const response = await request(app)
        .get('/api/v1/orti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Orto.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockOrto);
    });

    test('should return 404 when orto is not found', async () => {
      Orto.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/orti/507f1f77bcf86cd799439999')
        .expect(404);

      expect(response.body.message).toBe('Orto non trovato');
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database error');
      Orto.findById.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/orti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nel recupero dell\'orto');
    });
  });

  describe('PUT /api/v1/orti/:id', () => {
    test('should update orto and return it with status 200', async () => {
      const mockUpdatedOrto = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Orto San Bartolomeo Aggiornato',
        indirizzo: 'Via San Bartolomeo 15, Trento',
        coordinate: { lat: 46.0664, lng: 11.1257 },
        lotti: []
      };

      Orto.findByIdAndUpdate.mockResolvedValue(mockUpdatedOrto);

      const response = await request(app)
        .put('/api/v1/orti/507f1f77bcf86cd799439011')
        .send({ nome: 'Orto San Bartolomeo Aggiornato' })
        .expect(200);

      expect(Orto.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { nome: 'Orto San Bartolomeo Aggiornato' },
        { new: true }
      );
      expect(response.body.message).toBe('Orto aggiornato con successo');
      expect(response.body.data).toEqual(mockUpdatedOrto);
    });

    test('should return 404 when orto to update is not found', async () => {
      Orto.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/orti/507f1f77bcf86cd799439999')
        .send({ nome: 'Orto Non Esistente' })
        .expect(404);

      expect(response.body.message).toBe('Orto non trovato');
    });

    test('should return error 500 when update fails', async () => {
      const mockError = new Error('Update failed');
      Orto.findByIdAndUpdate.mockRejectedValue(mockError);

      const response = await request(app)
        .put('/api/v1/orti/507f1f77bcf86cd799439011')
        .send({ nome: 'Nuovo Nome' })
        .expect(500);

      expect(response.body.message).toBe('Errore nell\'aggiornamento dell\'orto');
    });
  });

  describe('DELETE /api/v1/orti/:id', () => {
    test('should delete orto and return success message with status 200', async () => {
      const mockDeletedOrto = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Orto Da Eliminare',
        indirizzo: 'Via Test 1, Trento',
        coordinate: { lat: 46.0664, lng: 11.1257 },
        lotti: []
      };

      Orto.findByIdAndDelete.mockResolvedValue(mockDeletedOrto);

      const response = await request(app)
        .delete('/api/v1/orti/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Orto.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body.message).toBe('Orto eliminato con successo');
    });

    test('should return 404 when orto to delete is not found', async () => {
      Orto.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/orti/507f1f77bcf86cd799439999')
        .expect(404);

      expect(response.body.message).toBe('Orto non trovato');
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Deletion failed');
      Orto.findByIdAndDelete.mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/api/v1/orti/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body.message).toBe('Errore nell\'eliminazione dell\'orto');
    });
  });

  describe('GET /api/v1/orti/search', () => {
    test('should search ortos by geographic location with status 200', async () => {
      const mockSearchResults = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Orto Vicino',
          indirizzo: 'Via Vicina 1, Trento',
          geometry: {
            type: 'Point',
            coordinates: [11.1200, 46.0700]
          },
          lotti: ['507f1f77bcf86cd799439021'],
          distance: 1500.5,
          lottiCount: 1,
          matchingLottiCount: 1
        }
      ];

      Orto.aggregate = jest.fn().mockResolvedValue(mockSearchResults);

      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ longitude: 11.1257, latitude: 46.0664, radius: 5000 })
        .expect(200);

      expect(Orto.aggregate).toHaveBeenCalledTimes(1);
      expect(response.body.count).toBe(1);
      expect(response.body.data).toEqual(mockSearchResults);
      expect(response.body.filters.longitude).toBe('11.1257');
      expect(response.body.filters.latitude).toBe('46.0664');
      expect(response.body.filters.radius).toBe('5000');
    });

    test('should search ortos by plot size with status 200', async () => {
      const mockSearchResults = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Orto Grande',
          indirizzo: 'Via Grande 1, Trento',
          geometry: {
            type: 'Point',
            coordinates: [11.1200, 46.0700]
          },
          lotti: ['507f1f77bcf86cd799439021'],
          lottiCount: 2,
          matchingLottiCount: 1
        }
      ];

      Orto.aggregate = jest.fn().mockResolvedValue(mockSearchResults);

      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ minSize: 50, maxSize: 200 })
        .expect(200);

      expect(Orto.aggregate).toHaveBeenCalledTimes(1);
      expect(response.body.count).toBe(1);
      expect(response.body.data).toEqual(mockSearchResults);
      expect(response.body.filters.minSize).toBe('50');
      expect(response.body.filters.maxSize).toBe('200');
    });

    test('should search ortos with sensors with status 200', async () => {
      const mockSearchResults = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Orto Tecnologico',
          indirizzo: 'Via Tecnologia 1, Trento',
          geometry: {
            type: 'Point',
            coordinates: [11.1200, 46.0700]
          },
          lotti: ['507f1f77bcf86cd799439021'],
          lottiCount: 3,
          matchingLottiCount: 2
        }
      ];

      Orto.aggregate = jest.fn().mockResolvedValue(mockSearchResults);

      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ hasSensors: true })
        .expect(200);

      expect(Orto.aggregate).toHaveBeenCalledTimes(1);
      expect(response.body.count).toBe(1);
      expect(response.body.data).toEqual(mockSearchResults);
      expect(response.body.filters.hasSensors).toBe('true');
    });

    test('should search ortos with combined filters with status 200', async () => {
      const mockSearchResults = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Orto Perfetto',
          indirizzo: 'Via Perfetta 1, Trento',
          geometry: {
            type: 'Point',
            coordinates: [11.1200, 46.0700]
          },
          lotti: ['507f1f77bcf86cd799439021'],
          distance: 2000.0,
          lottiCount: 2,
          matchingLottiCount: 1
        }
      ];

      Orto.aggregate = jest.fn().mockResolvedValue(mockSearchResults);

      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({
          longitude: 11.1257,
          latitude: 46.0664,
          radius: 5000,
          minSize: 50,
          maxSize: 200,
          hasSensors: true
        })
        .expect(200);

      expect(Orto.aggregate).toHaveBeenCalledTimes(1);
      expect(response.body.count).toBe(1);
      expect(response.body.data).toEqual(mockSearchResults);
      expect(response.body.filters.longitude).toBe('11.1257');
      expect(response.body.filters.minSize).toBe('50');
      expect(response.body.filters.hasSensors).toBe('true');
    });

    test('should return empty array when no ortos match filters', async () => {
      Orto.aggregate = jest.fn().mockResolvedValue([]);

      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ longitude: 11.1257, latitude: 46.0664, radius: 100 })
        .expect(200);

      expect(Orto.aggregate).toHaveBeenCalledTimes(1);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('should return 400 when coordinates are invalid', async () => {
      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ longitude: 'invalid', latitude: 46.0664, radius: 5000 })
        .expect(400);

      expect(response.body.message).toBe('Coordinate non valide');
    });

    test('should return 400 when latitude is missing with longitude', async () => {
      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ longitude: 11.1257, radius: 5000 })
        .expect(400);

      expect(response.body.message).toBe('Coordinate non valide');
    });

    test('should return 400 when radius is invalid', async () => {
      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ longitude: 11.1257, latitude: 46.0664, radius: 'invalid' })
        .expect(400);

      expect(response.body.message).toBe('Coordinate non valide');
    });

    test('should search without filters and return all ortos', async () => {
      const mockSearchResults = [
        {
          _id: '507f1f77bcf86cd799439011',
          nome: 'Orto 1',
          indirizzo: 'Via 1, Trento',
          geometry: {
            type: 'Point',
            coordinates: [11.1200, 46.0700]
          },
          lotti: [],
          lottiCount: 0,
          matchingLottiCount: 0
        },
        {
          _id: '507f1f77bcf86cd799439012',
          nome: 'Orto 2',
          indirizzo: 'Via 2, Trento',
          geometry: {
            type: 'Point',
            coordinates: [11.1300, 46.0800]
          },
          lotti: [],
          lottiCount: 0,
          matchingLottiCount: 0
        }
      ];

      Orto.aggregate = jest.fn().mockResolvedValue(mockSearchResults);

      const response = await request(app)
        .get('/api/v1/orti/search')
        .expect(200);

      expect(Orto.aggregate).toHaveBeenCalledTimes(1);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toEqual(mockSearchResults);
    });

    test('should return error 500 when database fails during search', async () => {
      const mockError = new Error('Aggregation pipeline failed');
      Orto.aggregate = jest.fn().mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/orti/search')
        .query({ longitude: 11.1257, latitude: 46.0664, radius: 5000 })
        .expect(500);

      expect(Orto.aggregate).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('Errore nella ricerca degli orti');
    });
  });
});
