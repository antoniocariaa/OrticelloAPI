/**
 * Template per aggiungere logging ai controller
 * 
 * Usa questo template come riferimento per aggiungere logging
 * a tutti i controller dell'applicazione.
 */

const Model = require('../model/modelName');
const logger = require('../config/logger');

// ========== GET ALL ==========
exports.getAll = async (req, res) => {
    try {
        logger.debug('Fetching all resources');
        const items = await Model.find();
        logger.db('SELECT', 'ModelName', true, { count: items.length });
        res.status(200).json(items);
    } catch (error) {
        logger.db('SELECT', 'ModelName', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_items'), error });
    }
};

// ========== GET BY ID ==========
exports.getById = async (req, res) => {
    try {
        logger.debug('Fetching resource by ID', { id: req.params.id });
        const item = await Model.findById(req.params.id);
        
        if (!item) {
            logger.warn('Resource not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.item') });
        }
        
        logger.db('SELECT', 'ModelName', true, { id: req.params.id });
        res.status(200).json(item);
    } catch (error) {
        logger.db('SELECT', 'ModelName', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_item'), error });
    }
};

// ========== CREATE ==========
exports.create = async (req, res) => {
    try {
        logger.debug('Creating new resource', { data: req.body });
        const newItem = new Model(req.body);
        const savedItem = await newItem.save();
        
        logger.db('INSERT', 'ModelName', true, { 
            id: savedItem._id, 
            // Aggiungi campi rilevanti del model
            name: savedItem.name 
        });
        
        res.status(201).json(savedItem);
    } catch (error) {
        logger.db('INSERT', 'ModelName', false, { 
            error: error.message, 
            data: req.body 
        });
        res.status(500).json({ message: req.t('errors.creating_item'), error });
    }
};

// ========== UPDATE ==========
exports.update = async (req, res) => {
    try {
        logger.debug('Updating resource', { id: req.params.id, data: req.body });
        const updatedItem = await Model.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        if (!updatedItem) {
            logger.warn('Resource not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.item') });
        }
        
        logger.db('UPDATE', 'ModelName', true, { 
            id: req.params.id,
            name: updatedItem.name 
        });
        
        res.status(200).json(updatedItem);
    } catch (error) {
        logger.db('UPDATE', 'ModelName', false, { 
            error: error.message, 
            id: req.params.id 
        });
        res.status(500).json({ message: req.t('errors.updating_item'), error });
    }
};

// ========== DELETE ==========
exports.delete = async (req, res) => {
    try {
        logger.debug('Deleting resource', { id: req.params.id });
        const deletedItem = await Model.findByIdAndDelete(req.params.id);
        
        if (!deletedItem) {
            logger.warn('Resource not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.item') });
        }
        
        logger.db('DELETE', 'ModelName', true, { 
            id: req.params.id,
            name: deletedItem.name 
        });
        
        res.status(200).json({ message: req.t('success.item_deleted') });
    } catch (error) {
        logger.db('DELETE', 'ModelName', false, { 
            error: error.message, 
            id: req.params.id 
        });
        res.status(500).json({ message: req.t('errors.deleting_item'), error });
    }
};

/**
 * BEST PRACTICES:
 * 
 * 1. Usa logger.debug() per dettagli di sviluppo
 * 2. Usa logger.info() per operazioni normali completate
 * 3. Usa logger.warn() per situazioni anomale (es. 404)
 * 4. Usa logger.error() per errori critici
 * 
 * 5. Usa logger.db() per operazioni database con:
 *    - Operazione: SELECT, INSERT, UPDATE, DELETE
 *    - Model name
 *    - Success: true/false
 *    - Context: dati rilevanti (id, count, error, etc.)
 * 
 * 6. Includi sempre contesto utile nei log:
 *    - IDs delle risorse
 *    - Conteggi
 *    - Messaggi di errore
 *    - NON includere dati sensibili (password, token)
 * 
 * 7. Log levels in produzione:
 *    - Produzione: warn o error
 *    - Staging: info
 *    - Sviluppo: debug
 */
