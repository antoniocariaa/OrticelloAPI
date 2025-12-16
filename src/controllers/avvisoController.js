const avviso = require('../model/news/avviso');

exports.getAllAvvisi = async (req, res) => {
    try {
        const avvisi = await avviso.find();
        res.status(200).json(avvisi);
    }
    catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_avvisi'), error });
    }
};

exports.createAvviso = async (req, res) => {
    try {
        const newAvviso = new avviso(req.body);
        const savedAvviso = await newAvviso.save();
        res.status(201).json({ data: savedAvviso, message: req.t('success.avviso_created') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.creating_avviso'), error });
    }
};

exports.getAvvisoById = async (req, res) => {
    try {
        const avviso = await avviso.findById(req.params.id);
        if (!avviso) {
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json(avviso);
    } catch (error) {
        res.status(500).json({ message: req.t('errors.retrieving_avviso'), error });
    }
};

exports.updateAvviso = async (req, res) => {
    try {
        const updatedAvviso = await avviso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAvviso) {
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json({ data: updatedAvviso, message: req.t('success.avviso_updated') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.updating_avviso'), error });
    }
};

exports.deleteAvviso = async (req, res) => {
    try {
        const deletedAvviso = await avviso.findByIdAndDelete(req.params.id);
        if (!deletedAvviso) {
            return res.status(404).json({ message: req.t('notFound.avviso') });
        }
        res.status(200).json({ message: req.t('success.avviso_deleted') });
    } catch (error) {
        res.status(500).json({ message: req.t('errors.deleting_avviso'), error });
    }
}