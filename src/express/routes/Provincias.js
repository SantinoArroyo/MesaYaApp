const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    const provincias = await models.Provincia.findAll();
    res.status(200).json(provincias);
}

async function getById(req, res) {
    const id = getIdParam(req);
    const provincia = await models.Provincia.findByPk(id);
    if (provincia) {
        res.status(200).json(provincia);
    } else {
        res.status(404).send('404 - Provincia no encontrada');
    }
}

module.exports = {
    getAll,
    getById,
};