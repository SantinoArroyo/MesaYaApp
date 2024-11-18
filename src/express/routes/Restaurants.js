const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = '12345678';
const multer = require('multer');
const fs = require('node:fs')

// Configura la ubicación donde se guardarán los archivos y el nombre del archivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directorio donde se guardará la imagen
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Nombre único para cada archivo
    }
});

// Crear el middleware `upload`
const upload = multer({ storage });

function saveImage(file) {
    const newPath = `./uploads/${file.originalname}`;
    fs.renameSync(file.path, newPath)
    return newPath
}

// Obtener todas las reservas
async function getAll(req, res) {
	const restaurant = await models.Restaurant.findAll();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Agrega la URL completa para cada imagen
    const restaurantsWithImageUrl = restaurant.map(restaurant => ({
        ...restaurant.toJSON(),
        imagen: restaurant.imagen ? `${baseUrl}/uploads/${restaurant.imagen}` : null,
    }));
	res.status(200).json(restaurantsWithImageUrl);
};

// Obtener la información de un restaurante por su ID
async function getById(req, res) {
    const id = getIdParam(req);
    const restaurant = await models.Restaurant.findOne({
        where: {
            idRestaurant: id
        }
    });
    if (restaurant) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const restaurantWithImageUrl = {
            ...restaurant.toJSON(),
            imagen: restaurant.imagen ? `${baseUrl}/uploads/${restaurant.imagen}` : null,
        };
        res.status(200).json(restaurantWithImageUrl);
    } else {
        res.status(404).send('404 - Restaurante no encontrado');
    }
}

// Obtener todas las reservas de un restaurante por su ID
async function getReservationsByRestaurantId(req, res) {
    const id = getIdParam(req);
    const reservations = await models.Reserva.findAll({
        where: {
            idRestaurant: id
        }
    });
    if (reservations) {
        res.status(200).json(reservations);
    } else {
        res.status(404).send('404 - Reservas no encontradas');
    }
}

// Crear una nueva reserva
async function create(req, res) {
    const { nombre, email, direccion, contraseña, telefono, categoria, cuit} = req.body;

	console.log('Datos recibidos en el backend:', req.body);
	console.log("Contraseña recibida:", contraseña);

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    
    try {
        const newUserR = await models.Restaurant.create({
            nombre,
            email,
            direccion,
            contraseña: hashedPassword,
            telefono,
            categoria,
            cuit
        });

		if (!newUserR || !newUserR.idRestaurant) {
            throw new Error("Error: El restaurante creado no tiene un ID.");
        }
        res.status(201).json(newUserR);
    } catch (error) {
        res.status(400).send('Error al registrar el usuario');
		console.log('Error al registrar el restaurant:', error.response ? error.response.data : error.message);
    }
};

async function uploadImage(req, res) {
    try {
        const restaurantId = req.params.id;
        const file = req.file;

        if (!file) {
            return res.status(400).send('No se ha subido ninguna imagen');
        }

        const restaurant = await models.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).send('Restaurante no encontrado');
        }

        saveImage(file);

        restaurant.imagen = file.originalname;
        await restaurant.save();

        res.status(200).send('Imagen subida correctamente');
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).send('Error al subir la imagen');
    }
}

// Actualizar un restaurante existente
async function update(req, res) {
    console.log('Datos recibidos en el backend:', req.body);
    const id = getIdParam(req);
    const file = req.file;

    // Solo aceptamos la solicitud de actualización si el parámetro `:id` coincide con el ID del cuerpo de la solicitud
    if (req.body.idRestaurant === id) {
        const restaurant = await models.Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).send('Restaurante no encontrado');
        }

        // Actualizar solo los campos proporcionados
        const updatedData = {
            nombre: req.body.nombre || restaurant.nombre,
            email: req.body.email || restaurant.email,
            direccion: req.body.direccion || restaurant.direccion,
            telefono: req.body.telefono || restaurant.telefono,
            categoria: req.body.categoria || restaurant.categoria,
            cuit: req.body.cuit || restaurant.cuit,
            imagen: file ? file.originalname : (req.body.imagen || restaurant.imagen)
        };

        // Solo actualizar la contraseña si se proporciona una nueva
        if (req.body.contraseña) {
            updatedData.contraseña = await bcrypt.hash(req.body.contraseña, 10);
        }

        await restaurant.update(updatedData);

        if (file) {
            saveImage(file);
        }

        res.status(200).end();
    } else {
        res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idRestaurant}).`);
    }
}

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

async function login(req, res) {
    const { email, contraseña } = req.body;

    try {
        // Buscar el restaurante por email
        const restaurant = await models.Restaurant.findOne({ where: { email } });
        
        if (!restaurant) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(contraseña, restaurant.contraseña);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token incluyendo el ID del restaurante
        const token = jwt.sign(
            { 
                id: restaurant.idRestaurant,
                email: restaurant.email
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Devolver token y datos completos del restaurante
        res.json({
            token,
            restaurant
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}


// Exportar las funciones
module.exports = {
	getAll,
    getById,
    getReservationsByRestaurantId,
	create,
	update,
	removeById,
	login,
	uploadImage
};