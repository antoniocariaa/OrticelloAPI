const Avviso = require('../model/news/avviso');
const AvvisoLetto = require('../model/news/avvisoLetto');
const logger = require('../config/logger');

exports.getAllAvvisi = async (req, res) => {
    try {
        const avvisi = await Avviso.find();
        res.status(200).json(avvisi);
    }
    catch (error) {
        logger.error('Error retrieving avvisi', { error: error.message });
        res.status(500).json({ message: req.t('errors.retrieving_avvisi'), error });
    }
};

exports.createAvviso = async (req, res) => {
    try {
        const newAvviso = new Avviso(req.body);
        const savedAvviso = await newAvviso.save();
        logger.db('INSERT', 'Avviso', true, { id: savedAvviso._id });
        res.status(201).json({ data: savedAvviso, message: req.t('success.avviso_created') });
    } catch (error) {
        logger.error('Error creating avviso', { error: error.message, data: req.body });
        res.status(500).json({ message: req.t('errors.creating_avviso'), error });
    }
};

exports.getAvvisoById = async (req, res) => {
    try {
        const avviso = await Avviso.findById(req.params.id);
        if (!avviso) {
            logger.warn('Avviso not found', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json(avviso);
    } catch (error) {
        logger.error('Error retrieving avviso by ID', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.retrieving_avviso'), error });
    }
};

exports.updateAvviso = async (req, res) => {
    try {
        const updatedAvviso = await Avviso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAvviso) {
            logger.warn('Avviso not found for update', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json({ data: updatedAvviso, message: req.t('success.avviso_updated') });
    } catch (error) {
        logger.error('Error updating avviso', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.updating_avviso'), error });
    }
};

exports.deleteAvviso = async (req, res) => {
    try {
        const deletedAvviso = await Avviso.findByIdAndDelete(req.params.id);
        if (!deletedAvviso) {
            logger.warn('Avviso not found for deletion', { id: req.params.id });
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json({ message: req.t('success.avviso_deleted') });
    } catch (error) {
        logger.error('Error deleting avviso', { error: error.message, id: req.params.id });
        res.status(500).json({ message: req.t('errors.deleting_avviso'), error });
    }
}

exports.getAvvisiFiltered = async (req, res) => {
    try {
        const {
            tipo,           // 'asso' or 'comu'
            entityId,       // ID of comune or associazione
            categoria,      // Category filter
            dataInizio,     // Start date (ISO format)
            dataFine,       // End date (ISO format)
            target,         // 'asso' or 'all' (for municipality notices)
            letto,          // true/false - filter by read status
            page = 1,       // Pagination
            limit = 20      // Items per page
        } = req.query;

        // Build query filter
        const filter = {};

        // Filter by entity type (asso/comu)
        if (tipo && ['asso', 'comu'].includes(tipo)) {
            filter.tipo = tipo;
        }

        // Filter by specific entity ID
        if (entityId) {
            if (tipo === 'comu') {
                filter.comune = entityId;
            } else if (tipo === 'asso') {
                filter.associazione = entityId;
            }
        }

        // Filter by category
        if (categoria) {
            filter.categoria = categoria;
        }

        // Filter by date range
        if (dataInizio || dataFine) {
            filter.data = {};
            if (dataInizio) {
                filter.data.$gte = new Date(dataInizio);
            }
            if (dataFine) {
                filter.data.$lte = new Date(dataFine);
            }
        }

        // Filter by target audience (only for municipality notices)
        if (target && ['asso', 'all'].includes(target)) {
            filter.target = target;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        // Execute query with pagination
        let avvisiQuery = Avviso.find(filter)
            .populate('comune', 'nome')
            .populate('associazione', 'nome')
            .sort({ data: -1 })
            .skip(skip)
            .limit(limitNum);

        const avvisi = await avvisiQuery;

        // If user is authenticated and letto filter is specified
        if (req.loggedUser && letto !== undefined) {
            const userId = req.loggedUser.id;
            const avvisiIds = avvisi.map(a => a._id);
            
            // Get all read avvisi by this user
            const avvisiLetti = await AvvisoLetto.find({
                utente: userId,
                avviso: { $in: avvisiIds }
            }).select('avviso');

            const lettiIds = new Set(avvisiLetti.map(al => al.avviso.toString()));

            // Filter based on read status
            const filteredAvvisi = avvisi.filter(avviso => {
                const isLetto = lettiIds.has(avviso._id.toString());
                return letto === 'true' ? isLetto : !isLetto;
            });

            // Get total count for pagination
            const totalCount = await Avviso.countDocuments(filter);

            return res.status(200).json({
                data: filteredAvvisi,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limitNum),
                    totalItems: totalCount,
                    itemsPerPage: limitNum
                }
            });
        }

        // Get total count for pagination
        const totalCount = await Avviso.countDocuments(filter);

        res.status(200).json({
            data: avvisi,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limitNum),
                totalItems: totalCount,
                itemsPerPage: limitNum
            }
        });

    } catch (error) {
        logger.error('Error retrieving filtered avvisi', { 
            error: error.message, 
            query: req.query 
        });
        res.status(500).json({ 
            message: req.t('errors.retrieving_avvisi'), 
            error: error.message 
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const avvisoId = req.params.id;
        const userId = req.loggedUser?.id;

        // Verify avviso exists
        const avviso = await Avviso.findById(avvisoId);
        if (!avviso) {
            logger.warn('Avviso not found for marking as read', { id: avvisoId });
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }

        // Use upsert to create or update read status
        const avvisoLetto = await AvvisoLetto.findOneAndUpdate(
            { utente: userId, avviso: avvisoId },
            { 
                utente: userId, 
                avviso: avvisoId, 
                dataLettura: new Date() 
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true
            }
        );

        logger.db('UPSERT', 'AvvisoLetto', true, { 
            userId, 
            avvisoId, 
            id: avvisoLetto._id 
        });

        res.status(200).json({ 
            message: req.t('success.avviso_marked_read') || 'Notice marked as read',
            data: {
                avvisoId: avvisoId,
                dataLettura: avvisoLetto.dataLettura
            }
        });

    } catch (error) {
        // Handle duplicate key error (race condition)
        if (error.code === 11000) {
            return res.status(200).json({ 
                message: req.t('success.avviso_already_read') || 'Notice already marked as read'
            });
        }

        logger.error('Error marking avviso as read', { 
            error: error.message, 
            id: req.params.id,
            userId: req.loggedUser?.id 
        });
        res.status(500).json({ 
            message: req.t('errors.marking_avviso_read') || 'Error marking notice as read', 
            error: error.message 
        });
    }
};

/**
 * Get read status for multiple avvisi for the authenticated user
 * Useful for bulk operations or displaying read/unread indicators
 */
exports.getReadStatus = async (req, res) => {
    try {
        const userId = req.loggedUser?.id;
        const { avvisiIds } = req.body; // Array of avviso IDs

        if (!userId) {
            return res.status(401).json({ 
                message: req.t('errors.unauthorized') || 'Authentication required' 
            });
        }

        if (!avvisiIds || !Array.isArray(avvisiIds)) {
            return res.status(400).json({ 
                message: req.t('errors.invalid_input') || 'Invalid input: avvisiIds array required' 
            });
        }

        // Get all read avvisi by this user from the provided list
        const avvisiLetti = await AvvisoLetto.find({
            utente: userId,
            avviso: { $in: avvisiIds }
        }).select('avviso dataLettura');

        // Create a map of avvisoId -> read status
        const readStatusMap = {};
        avvisiIds.forEach(id => {
            readStatusMap[id] = { letto: false, dataLettura: null };
        });

        avvisiLetti.forEach(al => {
            readStatusMap[al.avviso.toString()] = { 
                letto: true, 
                dataLettura: al.dataLettura 
            };
        });

        res.status(200).json({ data: readStatusMap });

    } catch (error) {
        logger.error('Error retrieving read status', { 
            error: error.message, 
            userId: req.loggedUser?.id 
        });
        res.status(500).json({ 
            message: req.t('errors.retrieving_read_status') || 'Error retrieving read status', 
            error: error.message 
        });
    }
};