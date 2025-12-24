const Orto  = require('../model/orto');
const logger = require('../config/logger');

exports.getAllOrtos = async (req, res) => {
    try {
        logger.debug('Fetching all ortos');
        const ortos = await Orto.find();
        logger.db('SELECT', 'Orto', true, { count: ortos.length });
        res.status(200).json(ortos);
    } catch (error) {
        logger.db('SELECT', 'Orto', false, { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_ortos'), error });
    }   
};

exports.createOrto = async (req, res) => {
    try {
        const newOrto = new Orto(req.body);
        logger.debug('Creating new orto', { data: req.body });
        const savedOrto = await newOrto.save();
        logger.db('INSERT', 'Orto', true, { id: savedOrto._id, nome: savedOrto.nome });
        res.status(201).json({ message: req.t('success.orto_created'), data: savedOrto });
    } catch (error) {
        logger.db('INSERT', 'Orto', false, { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_orto'), error });
    }  
};

exports.getOrtoById = async (req, res) => {
    try {
        logger.debug('Fetching orto by ID', { id: req.params.id });
        const orto = await Orto.findById(req.params.id);
        if (!orto) {
            logger.warn('Orto not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.orto') });
        }
        logger.db('SELECT', 'Orto', true, { id: req.params.id });
        res.status(200).json(orto);
    } catch (error) {
        logger.db('SELECT', 'Orto', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_orto'), error });
    }   
};

exports.updateOrto = async (req, res) => {
    try {
        logger.debug('Updating orto', { id: req.params.id, data: req.body });
        const updatedOrto = await Orto.findByIdAndUpdate(req.params.id, req.body, { new: true });    
        if (!updatedOrto) {
            logger.warn('Orto not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.orto') });
        }  
        logger.db('UPDATE', 'Orto', true, { id: req.params.id, nome: updatedOrto.nome });
        res.status(200).json({ message: req.t('success.orto_updated'), data: updatedOrto });
    } catch (error) {
        logger.db('UPDATE', 'Orto', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_orto'), error });
    }
};

exports.deleteOrto = async (req, res) => {
    try {
        logger.debug('Deleting orto', { id: req.params.id });
        const deletedOrto = await Orto.findByIdAndDelete(req.params.id);

        //TO-DO: Verificare se ci sono utenti che possiedono questo orto prima di eliminarlo
        

        if (!deletedOrto) {
            logger.warn('Orto not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.orto') });
        }
        logger.db('DELETE', 'Orto', true, { id: req.params.id, nome: deletedOrto.nome });
        res.status(200).json({ message: req.t('success.orto_deleted') });
    } catch (error) {
        logger.db('DELETE', 'Orto', false, { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_orto'), error });
    }               
};