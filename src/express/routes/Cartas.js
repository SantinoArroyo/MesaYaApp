const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

// Obtener todas las cartas
async function getAll(req, res) {
	const cartas = await models.carta.findAll();
	res.status(200).json(cartas);
};

// Obtener una carta por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const carta = await models.carta.findOne({
		where: {
			idCarta: id  
		}
	});
	if (carta) {
		res.status(200).json(carta);
	} else {
		res.status(404).send('404 - Carta no encontrada');
	}
};

// Crear una nueva carta
async function create(req, res) {
	if (req.body.idCarta) { 
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.carta.create(req.body);
		res.status(201).end();
	}
};

// Actualizar una carta existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idCarta === id) {  
		await models.carta.update(req.body, {
			where: {
				idCarta: id 
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idCarta}).`);
	}
};

// Eliminar una carta
async function remove(req, res) {
	const id = getIdParam(req);
	await models.carta.destroy({
		where: {
			idCarta: id  
		}
	});
	res.status(200).end();
};

// Exportar las funciones
module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};
