const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

// Obtener todos los clientes
async function getAll(req, res) {
	const clientes = await models.Cliente.findAll();
	res.status(200).json(clientes);
};

// Obtener un cliente por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const cliente = await models.Cliente.findOne({
		where: {
			idCliente: id  
		}
	});
	if (cliente) {
		res.status(200).json(cliente);
	} else {
		res.status(404).send('404 - Cliente no encontrado');
	}
};

// Crear un nuevo cliente
async function create(req, res) {
	if (req.body.idCliente) {  
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.Cliente.create(req.body);
		res.status(201).end();
	}
};

// Actualizar un cliente existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idCliente === id) {  
		await models.Cliente.update(req.body, {
			where: {
				idCliente: id  
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idCliente}).`);
	}
};

// Eliminar un cliente
async function remove(req, res) {
	const id = getIdParam(req);
	await models.Cliente.destroy({
		where: {
			idCliente: id  
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
