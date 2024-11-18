const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

// Obtener una reserva por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const reserva = await models.Reserva.findOne({
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

// Obtener todas las reservas de un restaurante por su ID
async function getByRestaurantId(req, res) {
    const id = getIdParam(req);
    const reservas = await models.Reserva.findAll({
        where: {
            idRestaurant: id
        },
        include: [
            { model: models.Cliente, attributes: ['nombre'] },
            { model: models.Mesa, attributes: ['numero', 'cantidadPersonas'] }
        ]
    });
    if (reservas) {
        res.status(200).json(reservas);
    } else {
        res.status(404).send('404 - Reservas no encontradas');
    }
}

// Crear una nueva reserva
async function create(req, res) {
	if (req.body.idReserva) {  
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.Reserva.create(req.body);
		res.status(201).end();
	}
};

// Actualizar una reserva existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idReserva === id) {  // Cambiado a `idReserva`
		await models.Reserva.update(req.body, {
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
async function removeById(req, res) {
	const id = getIdParam(req);
	await models.Reserva.destroy({
		where: {
			idReserva: id 
		}
	});
	res.status(200).end();
};

// Exportar las funciones
module.exports = {
    getByRestaurantId,
	getById,
	create,
	update,
	removeById,
};
