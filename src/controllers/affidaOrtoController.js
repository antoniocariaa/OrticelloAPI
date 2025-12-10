const AffidaOrto = require('../model/affidaOrto');

exports.getAllAffidaOrti = async (req, res) => {
    try {
        const affidamenti = await AffidaOrto.find()
            .populate("orto")
            .populate("associazione");

        res.status(200).json(affidamenti);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving affidamenti', error });
    }
};

exports.createAffidaOrto = async (req, res) => {
    try {
        const newAffidamento = new AffidaOrto(req.body);
        const saved = await newAffidamento.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Error creating affidamento', error });
    }
};

exports.getAffidaOrtoById = async (req, res) => {
    try {
        const affidamento = await AffidaOrto.findById(req.params.id)
            .populate("orto")
            .populate("associazione");

        if (!affidamento) {
            return res.status(404).json({ message: 'Affidamento not found' });
        }

        res.status(200).json(affidamento);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving affidamento', error });
    }
};

exports.updateAffidaOrto = async (req, res) => {
    try {
        const updated = await AffidaOrto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Affidamento not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating affidamento', error });
    }
};

exports.deleteAffidaOrto = async (req, res) => {
    try {
        const deleted = await AffidaOrto.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Affidamento not found' });
        }

        res.status(200).json({ message: 'Affidamento deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting affidamento', error });
    }
};
