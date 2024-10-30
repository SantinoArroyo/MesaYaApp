const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    const localidades = await models.Localidad.findAll();
    res.status(200).json(localidades);
}

async function getById(req, res) {
    const id = getIdParam(req);
    const localidad = await models.Localidad.findByPk(id);
    if (localidad) {
        res.status(200).json(localidad);
    } else {
        res.status(404).send('404 - Localidad no encontrada');
    }
}

async function getByProvincia(req, res) {
    const idProvincia = getIdParam(req);
    const localidades = await models.Localidad.findAll({
        where: { idProvincia: idProvincia }
    });
    res.status(200).json(localidades);
}

module.exports = {
    getAll,
    getById,
    getByProvincia,
};