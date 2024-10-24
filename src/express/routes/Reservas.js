const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

// Obtener todas las reservas
async function getAll(req, res) {
	const reservas = await models.reserva.findAll();
	res.status(200).json(reservas);
};

// Obtener una reserva por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const reserva = await models.reserva.findOne({
		where: {
			idReserva: id  
		}
	});
	if (reserva) {
		res.status(200).json(reserva);
	} else {
		res.status(404).send('404 - Reserva no encontrada');
	}
};

// Crear una nueva reserva
async function create(req, res) {
	if (req.body.idReserva) {  
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.reserva.create(req.body);
		res.status(201).end();
	}
};

// Actualizar una reserva existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idReserva === id) {  // Cambiado a `idReserva`
		await models.reserva.update(req.body, {
			where: {
				idReserva: id  
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idReserva}).`);
	}
};

// Eliminar una reserva
async function remove(req, res) {
	const id = getIdParam(req);
	await models.reserva.destroy({
		where: {
			idReserva: id 
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
