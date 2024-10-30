const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

// Obtener todas las reservas
async function getAll(req, res) {
	const restaurant = await models.Restaurant.findAll();
	res.status(200).json(restaurant);
};

// Obtener una reserva por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const restaurant = await models.Restaurant.findOne({
		where: {
			idRestaurant: id  
		}
	});
	if (restaurant) {
		res.status(200).json(restaurant);
	} else {
		res.status(404).send('404 - Reserva no encontrada');
	}
};

// Crear una nueva reserva
async function create(req, res) {
	if (req.body.idRestaurant) { 
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.Restaurant.create(req.body);
		res.status(201).end();
	}
};

// Actualizar una reserva existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idRestaurant === id) {  
		await models.Restaurant.update(req.body, {
			where: {
				idRestaurant: id  
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idReserva}).`);
	}
};

// Eliminar una reserva
async function removeById(req, res) {
	const id = getIdParam(req);
	await models.Restaurant.destroy({
		where: {
			idRestaurant: id  
		}
	});
	res.status(200).end();
};
async function getByProvinciaAndLocalidad(req, res) {
    const idProvincia = req.query.idProvincia;
    const idLocalidad = req.query.idLocalidad;

    const whereClause = {};
    if (idProvincia) whereClause.idProvincia = idProvincia;
    if (idLocalidad) whereClause.idLocalidad = idLocalidad;

    const restaurants = await models.Restaurant.findAll({
        where: whereClause,
        include: [
            { model: models.Provincia },
            { model: models.Localidad }
        ]
    });

    res.status(200).json(restaurants);
}


// Exportar las funciones
module.exports = {
	getAll,
	getById,
	create,
	update,
	removeById,
	getByProvinciaAndLocalidad,
};