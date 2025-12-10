const AffidaLotto = require('../model/affidaLotto');

exports.getAllAffidaLotti = async (req, res) => {
    try {
        const affidamenti = await AffidaLotto.find()
            .populate("lotto")
            .populate("utente");
        res.status(200).json(affidamenti);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving affidamenti', error});
    }
};

exports.createAffidaLotto = async (req, res) => {
    try {
        const newAffidamento = new AffidaLotto(req.body);
        const saved = await newAffidamento.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Error creating affidamento', error });
    }
};

exports.getAffidaLottoById = async (req, res) => {
    try {
        const affidamento = await AffidaLotto.findById(req.params.id)
            .populate("lotto")
            .populate("utente");
        if (!affidamento) {
            return res.status(404).json({ message: 'Affidamento not found' });
        }
        res.status(200).json(affidamento);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving affidamento', error });
    }
};

exports.updateAffidaLotto = async (req, res) => {
    try {
        const updated = await AffidaLotto.findByIdAndUpdate(
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

exports.deleteAffidaLotto = async (req, res) => {
    try {
        const deleted = await AffidaLotto.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Affidamento not found' });
        }
        res.status(200).json({ message: 'Affidamento deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting affidamento', error });
    }
};

exports.addColtura = async (req, res) => {
    const { coltura } = req.body;  

    if (!coltura) {
        return res.status(400).json({ message: "Coltura is required" });
    }

    try {
        const affida = await AffidaLotto.findById(req.params.id);
        if (!affida) {
            return res.status(404).json({ message: "Affidamento not found" });
        }

        affida.culture.push(coltura);
        await affida.save();

        res.status(200).json({
            message: "Coltura added successfully",
            culture: affida.culture
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding coltura", error });
    }
};

exports.removeColtura = async (req, res) => {
    const colturaToRemove = req.params.coltura; 

    try {
        const affida = await AffidaLotto.findById(req.params.id);
        if (!affida) {
            return res.status(404).json({ message: "Affidamento not found" });
        }

        const index = affida.culture.indexOf(colturaToRemove);
        if (index === -1) {
            return res.status(404).json({ message: "Coltura not found" });
        }

        affida.culture.splice(index, 1);
        await affida.save();

        res.status(200).json({
            message: "Coltura removed successfully",
            culture: affida.culture
        });

    } catch (error) {
        res.status(500).json({ message: "Error removing coltura", error });
    }
};

