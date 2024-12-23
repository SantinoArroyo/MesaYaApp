const { models } = require('../../sequelize');  // Asegúrate de que esta ruta apunte correctamente a tu archivo sequelize
const { getIdParam } = require('../helpers');  // Asegúrate de tener esta función implementada en helpers

// Obtener todas las bebidas
async function getAll(req, res) {
	const bebidas = await models.Bebida.findAll();
	res.status(200).json(bebidas);
};

// Obtener una bebida por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const bebida = await models.Bebida.findOne({
		where: {
			idBebida: id   
		}
	});
	if (bebida) {
		res.status(200).json(bebida);
	} else {
		res.status(404).send('404 - Bebida no encontrada');
	}
};

// Obtener todas las bebidas de un restaurante por su ID
async function getByRestaurantId(req, res) {
    const id = getIdParam(req);
    const bebidas = await models.Bebida.findAll({
        where: {
            idRestaurant: id
        }
    });
    if (bebidas) {
        res.status(200).json(bebidas);
    } else {
        res.status(404).send('404 - Bebidas no encontradas');
    }
}

// Crear una nueva bebida
async function create(req, res) {
	if (req.body.idBebida) {  
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.Bebida.create(req.body);
		res.status(201).end();
	}
};

// Actualizar una bebida existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idBebida === id) {  
		await models.Bebida.update(req.body, {
			where: {
				idBebida: id  
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idBebida}).`);  // Cambiado a `idBebida`
	}
};

// Eliminar una bebida
async function removeById(req, res) {
	const id = getIdParam(req);
	await models.Bebida.destroy({
		where: {
			idBebida: id  
		}
	});
	res.status(200).end();
};


// Exportar las funciones
module.exports = {
	getByRestaurantId,
	getAll,
	getById,
	create,
	update,
	removeById,
};
