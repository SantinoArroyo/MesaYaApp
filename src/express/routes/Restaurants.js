const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = '12345678';
const multer = require('multer');
const fs = require('node:fs');

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
    fs.renameSync(file.path, newPath);
    return newPath;
}

// Obtener todos los restaurantes
async function getAll(req, res) {
    const restaurant = await models.Restaurant.findAll();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Agrega la URL completa para cada imagen
    const restaurantsWithImageUrl = restaurant.map(restaurant => ({
        ...restaurant.toJSON(),
        imagen: restaurant.imagen ? `${baseUrl}/uploads/${restaurant.imagen}` : null,
    }));
    res.status(200).json(restaurantsWithImageUrl);
}

// Obtener un restaurante por ID
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
        res.status(404).send('404 - Restaurante no encontrado');
    }
}

// Crear un nuevo restaurante
async function create(req, res) {
    const { nombre, email, direccion, contraseña, telefono, categoria, cuit, provincia, localidad} = req.body;

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
            cuit,
            idProvincia: provincia,
            idLocalidad: localidad,
        });

        if (!newUserR || !newUserR.id) {
            throw new Error("Error: El restaurante creado no tiene un ID.");
        }
        res.status(201).json(newUserR);
    } catch (error) {
        res.status(400).send('Error al registrar el usuario');
        console.log('Error al registrar el restaurant:', error.response ? error.response.data : error.message);
    }
}

// Actualizar un restaurante existente
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
        res.status(400).send(`Bad request: El ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.idRestaurant}).`);
    }
}

// Eliminar un restaurante
async function removeById(req, res) {
    const id = getIdParam(req);
    await models.Restaurant.destroy({
        where: {
            idRestaurant: id  
        }
    });
    res.status(200).end();
}

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

async function login (req, res) {
    const {email, contraseña} = req.body;
    const user = await models.Restaurant.findOne({where: {email}})

    if(!user) {
        return res.status(401).send('Usuario o contraseña incorrectos')
    }

    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña)

    if(!isPasswordValid){
        return res.status(401).send('Usuario o contraseña incorrectos')
    }

    const token = jwt.sign({ id: user.idRestaurant, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ token });
}

async function uploadImage(req, res) {
    console.log('Contenido de req.file:', req.file); // Verifica el contenido de req.file
    try {
        const restaurantId = req.params.id;
        const file = req.file;
        console.log(file)

        if (!file) {
            return res.status(400).send('No se ha subido ninguna imagen');
        }

        const restaurant = await models.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).send('Restaurante no encontrado');
        }

        saveImage(file)

        restaurant.imagen = file.originalname;
        await restaurant.save();

        res.status(200).send('Imagen subida correctamente');
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).send('Error al subir la imagen');
    }
}

// Exportar las funciones
module.exports = {
    getAll,
    getById,
    create,
    update,
    removeById,
    getByProvinciaAndLocalidad,
    login,
    uploadImage,
    upload // Exportar el middleware upload
};