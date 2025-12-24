const RichiestaLotto = require("../model/richiestaLotto");
const logger = require("../config/logger");

exports.getAllRichiestaLotto = async (req, res) => {
    try {
        const richieste = await RichiestaLotto.find().populate('id_lotto').populate('id_utente');
        res.status(200).json(richieste);
    } catch (error) {
        logger.error("Error retrieving requests", { error: error.message });
        res.status(500).json({ message: "Error retrieving requests", error: error.message });
    }
};

exports.getRichiestaLottoById = async (req, res) => {
    try {
        const richiesta = await RichiestaLotto.findById(req.params.id).populate('id_lotto').populate('id_utente');
        if (!richiesta) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.status(200).json(richiesta);
    } catch (error) {
        logger.error("Error retrieving request", { error: error.message });
        res.status(500).json({ message: "Error retrieving request", error: error.message });
    }
};

exports.createRichiestaLotto = async (req, res) => {
    try {
        const newRichiesta = new RichiestaLotto(req.body);
        const savedRichiesta = await newRichiesta.save();
        res.status(201).json(savedRichiesta);
    } catch (error) {
        logger.error("Error creating request", { error: error.message });
        res.status(500).json({ message: "Error creating request", error: error.message });
    }
};

exports.updateRichiestaLotto = async (req, res) => {
    try {
        const updatedRichiesta = await RichiestaLotto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRichiesta) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.status(200).json(updatedRichiesta);
    } catch (error) {
        logger.error("Error updating request", { error: error.message });
        res.status(500).json({ message: "Error updating request", error: error.message });
    }
};

exports.deleteRichiestaLotto = async (req, res) => {
    try {
        const deletedRichiesta = await RichiestaLotto.findByIdAndDelete(req.params.id);
        if (!deletedRichiesta) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        logger.error("Error deleting request", { error: error.message });
        res.status(500).json({ message: "Error deleting request", error: error.message });
    }
};
