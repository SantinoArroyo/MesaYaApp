const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');


// Obtener un plato por ID
async function getById(req, res) {
	const id = getIdParam(req);
	const plato = await models.Plato.findOne({
		where: {
			idPlato: id  
		}
	});
	if (plato) {
		res.status(200).json(plato);
	} else {
		res.status(404).send('404 - Plato no encontrado');
	}
};

// Obtener todos los platos de un restaurante por su ID
async function getByRestaurantId(req, res) {
    const id = getIdParam(req);
    const platos = await models.Plato.findAll({
        where: {
            idRestaurant: id
        }
    });
    if (platos) {
        res.status(200).json(platos);
    } else {
        res.status(404).send('404 - Platos no encontrados');
    }
}

// Crear un nuevo plato
async function create(req, res) {
	if (req.body.idPlato) { 
		res.status(400).send(`Bad request: El ID no debe proporcionarse, ya que lo determina automáticamente la base de datos.`);
	} else {
		await models.Plato.create(req.body);
		res.status(201).end();
	}
};

// Actualizar un plato existente
async function update(req, res) {
	const id = getIdParam(req);

	// Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
	if (req.body.idPlato === id) {  
		await models.Plato.update(req.body, {
			where: {
				idPlato: id  
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idPlato}).`);
	}
};

// Eliminar un plato
async function removeById(req, res) {
	const id = getIdParam(req);
	await models.Plato.destroy({
		where: {
			idPlato: id  
		}
	});
	res.status(200).end();
};
// Eliminar todos los platos
async function removeAll(req, res) {
    try {
        await models.Plato.destroy({
            where: {},  // Esto elimina todos los platos
            truncate: true  // Esto reinicia  el contador de ID
        });
        res.status(200).json({ message: 'Todos los platos han sido eliminados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar todos los platos', error: error.message });
    }
}
// Exportar las funciones
module.exports = {
	getById,
	create,
	update,
	removeById,
	removeAll,
	getByRestaurantId,
};