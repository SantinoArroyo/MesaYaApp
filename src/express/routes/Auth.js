const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { models } = require('../../sequelize'); // Asegúrate de que el path esté correcto

const router = express.Router();
const JWT_SECRET = '12345678'; // Define una clave secreta segura y no la expongas en el código.

router.post('/logincliente', async (req, res) => {
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
});

router.post('/loginrestaurant', async (req, res) => {
    const { email, contraseña } = req.body;
    
    // Busca el usuario por email
    const user = await models.Restaurant.findOne({ where: { email } });
    
    if (!user) {
        return res.status(401).send('Usuario o contraseña incorrectos');
    }
    
    // Verifica la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    
    if (!isPasswordValid) {
        return res.status(401).send('Usuario o contraseña incorrectos');
    }
    
    // Crea el token
    const token = jwt.sign({ id: user.idRestaurant, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ token });
});




router.post('/registercliente', async (req, res) => {
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
            direccion
        });
        res.status(201).json(newUserC);
    } catch (error) {
        res.status(400).send('Error al registrar el usuario');
    }
});

router.post('/registerrestaurant', async (req, res) => {
    const { nombre, email, direccion, contraseña, telefono, categoria, CUIT } = req.body;

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
            CUIT
        });
        res.status(201).json(newUserR);
    } catch (error) {
        res.status(400).send('Error al registrar el usuario');
    }
});

module.exports = router;
