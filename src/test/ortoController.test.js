const Orto = require('../model/orto');
const ortoController = require('../controllers/ortoController');

// Mock del model Orto
jest.mock('../model/orto');

describe('OrtoController', () => {
  let req, res;

  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();

    // Mock degli oggetti request e response
    req = {
      body: {},
      params: {},
      t: jest.fn((key) => key) // Mock della funzione di traduzione
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getAllOrtos', () => {
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

      await ortoController.getAllOrtos(req, res);

      expect(Orto.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrtos);
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database connection failed');
      Orto.find.mockRejectedValue(mockError);

      await ortoController.getAllOrtos(req, res);

      expect(Orto.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'errors.retrieving_ortos',
        error: mockError
      });
    });
  });

  describe('createOrto', () => {
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

      req.body = mockOrtoData;

      // Mock del costruttore e del metodo save
      const saveMock = jest.fn().mockResolvedValue(mockSavedOrto);
      Orto.mockImplementation(() => ({
        save: saveMock
      }));

      await ortoController.createOrto(req, res);

      expect(Orto).toHaveBeenCalledWith(mockOrtoData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'success.orto_created', data: mockSavedOrto });
    });

    test('should return error 500 when creation fails', async () => {
      const mockError = new Error('Validation failed');
      req.body = {
        nome: 'Orto Incompleto'
        // Missing required fields
      };

      const saveMock = jest.fn().mockRejectedValue(mockError);
      Orto.mockImplementation(() => ({
        save: saveMock
      }));

      await ortoController.createOrto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'errors.creating_orto',
        error: mockError
      });
    });
  });

  describe('getOrtoById', () => {
    test('should return orto by id with status 200', async () => {
      const mockOrto = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Orto San Bartolomeo',
        indirizzo: 'Via San Bartolomeo 15, Trento',
        coordinate: { lat: 46.0664, lng: 11.1257 },
        lotti: []
      };

      req.params.id = '507f1f77bcf86cd799439011';
      Orto.findById.mockResolvedValue(mockOrto);

      await ortoController.getOrtoById(req, res);

      expect(Orto.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrto);
    });

    test('should return 404 when orto is not found', async () => {
      req.params.id = '507f1f77bcf86cd799439999';
      Orto.findById.mockResolvedValue(null);

      await ortoController.getOrtoById(req, res);

      expect(Orto.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439999');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'notFound.orto' });
    });

    test('should return error 500 when database fails', async () => {
      const mockError = new Error('Database error');
      req.params.id = '507f1f77bcf86cd799439011';
      Orto.findById.mockRejectedValue(mockError);

      await ortoController.getOrtoById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'errors.retrieving_orto',
        error: mockError
      });
    });
  });

  describe('updateOrto', () => {
    test('should update orto and return it with status 200', async () => {
      const mockUpdatedOrto = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Orto San Bartolomeo Aggiornato',
        indirizzo: 'Via San Bartolomeo 15, Trento',
        coordinate: { lat: 46.0664, lng: 11.1257 },
        lotti: []
      };

      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { nome: 'Orto San Bartolomeo Aggiornato' };

      Orto.findByIdAndUpdate.mockResolvedValue(mockUpdatedOrto);

      await ortoController.updateOrto(req, res);

      expect(Orto.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { nome: 'Orto San Bartolomeo Aggiornato' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'success.orto_updated', data: mockUpdatedOrto });
    });

    test('should return 404 when orto to update is not found', async () => {
      req.params.id = '507f1f77bcf86cd799439999';
      req.body = { nome: 'Orto Non Esistente' };

      Orto.findByIdAndUpdate.mockResolvedValue(null);

      await ortoController.updateOrto(req, res);

      expect(Orto.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439999',
        { nome: 'Orto Non Esistente' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'notFound.orto' });
    });

    test('should return error 500 when update fails', async () => {
      const mockError = new Error('Update failed');
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { nome: 'Nuovo Nome' };

      Orto.findByIdAndUpdate.mockRejectedValue(mockError);

      await ortoController.updateOrto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'errors.updating_orto',
        error: mockError
      });
    });
  });

  describe('deleteOrto', () => {
    test('should delete orto and return success message with status 200', async () => {
      const mockDeletedOrto = {
        _id: '507f1f77bcf86cd799439011',
        nome: 'Orto Da Eliminare',
        indirizzo: 'Via Test 1, Trento',
        coordinate: { lat: 46.0664, lng: 11.1257 },
        lotti: []
      };

      req.params.id = '507f1f77bcf86cd799439011';
      Orto.findByIdAndDelete.mockResolvedValue(mockDeletedOrto);

      await ortoController.deleteOrto(req, res);

      expect(Orto.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'success.orto_deleted' });
    });

    test('should return 404 when orto to delete is not found', async () => {
      req.params.id = '507f1f77bcf86cd799439999';
      Orto.findByIdAndDelete.mockResolvedValue(null);

      await ortoController.deleteOrto(req, res);

      expect(Orto.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439999');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'notFound.orto' });
    });

    test('should return error 500 when deletion fails', async () => {
      const mockError = new Error('Deletion failed');
      req.params.id = '507f1f77bcf86cd799439011';

      Orto.findByIdAndDelete.mockRejectedValue(mockError);

      await ortoController.deleteOrto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'errors.deleting_orto',
        error: mockError
      });
    });
  });
});
