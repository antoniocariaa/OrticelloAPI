const bando = require('../model/news/bando');

exports.getAllBandi = async (req, res) => {
    try {
        const bandi = await bando.find();
        res.status(200).json(bandi);
    }
    catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_bandi'), error });
    }
};

exports.createBando = async (req, res) => {
    try {
        const newBando = new bando(req.body);
        const savedBando = await newBando.save();
        res.status(201).json({ data: savedBando, message: req.t('success.bando_created') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.creating_bando'), error });
    }
};

exports.getBandoById = async (req, res) => {
    try {
        const bando = await bando.findById(req.params.id);
        if (!bando) {
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        res.status(200).json({ data: bando, message: req.t('success.bando_retrieved') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_bando'), error });
    }
};

exports.updateBando = async (req, res) => {
    try {
        const updatedBando = await bando.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedBando) {
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        res.status(200).json({ data: updatedBando, message: req.t('success.bando_updated') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.updating_bando'), error });
    }
};

exports.deleteBando = async (req, res) => {
    try {
        const deletedBando = await bando.findByIdAndDelete(req.params.id);
        if (!deletedBando) {
            return res.status(404).json({ message: req.t('notFound.bando') });
        }
        res.status(200).json({ message: req.t('success.bando_deleted') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.deleting_bando'), error });
    }
};
