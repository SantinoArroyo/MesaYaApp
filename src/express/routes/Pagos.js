const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

// Obtener todos los pagos
async function getAll(req, res) {
	const pagos = await models.Pago.findAll();
	res.status(200).json(pagos);
};

// Obtener un pago por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const pago = await models.Pago.findOne({
		where: {
			idPago: id  
		}
	});
	if (pago) {
		res.status(200).json(pago);
	} else {
		res.status(404).send('404 - Pago no encontrado');
	}
};

// Crear un nuevo pago
async function create(req, res) {
	if (req.body.idPago) {  
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.Pago.create(req.body);
		res.status(201).end();
	}
};

// Actualizar un pago existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idPago === id) {  
		await models.Pago.update(req.body, {
			where: {
				idPago: id  
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idPago}).`);
	}
};

// Eliminar un pago
async function removeById(req, res) {
	const id = getIdParam(req);
	await models.Pago.destroy({
		where: {
			idPago: id 
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
	removeById,
};
