const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = '12345678';

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

	const { nombre, apellido, email, contraseña, telefono, direccion } = req.body;
    // Hashea la contraseña
	const hashedPassword = await bcrypt.hash(contraseña, 10);

    try {
        const newUserC = await models.Cliente.create({
            nombre,
            apellido,
            email,
            contraseña: hashedPassword,
            telefono,
            direccion,
        });
        res.status(201).json(newUserC);
    } catch (error) {
        res.status(400).send('Error al registrar el usuario');
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
async function removeById(req, res) {
	const id = getIdParam(req);
	await models.Cliente.destroy({
		where: {
			idCliente: id  
		}
	});
	res.status(200).end();
};

async function login(req, res) {
    const { email, contraseña } = req.body;
    
    // Busca el usuario por email
    const user = await models.Cliente.findOne({ where: { email } });
    
    if (!user) {
        return res.status(401).send('Usuario o contraseña incorrectos');
    }
    
    // Verifica la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    
    if (!isPasswordValid) {
        return res.status(401).send('Usuario o contraseña incorrectos');
    }
    
    // Crea el token
    const token = jwt.sign({ id: user.idCliente, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ token });
}

// Exportar las funciones
module.exports = {
	getAll,
	getById,
	create,
	update,
	removeById,
	login
};
