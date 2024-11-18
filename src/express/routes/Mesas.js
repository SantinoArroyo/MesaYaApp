const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

// Obtener todas las mesas
async function getAll(req, res) {
	const mesas = await models.Mesa.findAll();
	res.status(200).json(mesas);
};

// Obtener una mesa por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const mesa = await models.Mesa.findOne({
		where: {
			idMesa: id  
		}
	});
	if (mesa) {
		res.status(200).json(mesa);
	} else {
		res.status(404).send('404 - Mesa no encontrada');
	}
};

// Obtener todas las mesas de un restaurante por su ID
async function getByRestaurantId(req, res) {
    const id = getIdParam(req);
    const mesas = await models.Mesa.findAll({
        where: {
            idRestaurant: id
        }
    });
    if (mesas) {
        res.status(200).json(mesas);
    } else {
        res.status(404).send('404 - Mesas no encontradas');
    }
}

// Crear una nueva mesa
async function create(req, res) {
	if (req.body.idMesa) {  
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.Mesa.create(req.body);
		res.status(201).end();
	}
};

// Actualizar una mesa existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idMesa === id) {  
		await models.Mesa.update(req.body, {
			where: {
				idMesa: id  
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idMesa}).`);
	}
};

// Eliminar una mesa
async function removeById(req, res) {
	const id = getIdParam(req);
	await models.Mesa.destroy({
		where: {
			idMesa: id  
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
	getByRestaurantId,
};
