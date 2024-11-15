const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { models } = require('../sequelize');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const routes = {
    bebidas: require('./routes/Bebidas'),
    cartas: require('./routes/Cartas'),
    clientes: require('./routes/Clientes'),
    mesas: require('./routes/Mesas'),
    pagos: require('./routes/Pagos'),
    platos: require('./routes/Platos'),
    reservas: require('./routes/Reservas'),
    restaurants: require('./routes/Restaurants'),
    provincias: require('./routes/Provincias'),
    localidades: require('./routes/Localidades')
}

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto a la URL de tu frontend
    credentials: true
}));

app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

function makeHandlerAwareOfAsyncErrors(handler) {
    return async function(req, res, next) {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}

for (const [routeName, routeController] of Object.entries(routes)) {
    if (routeController.getAll) {
        app.get(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.getAll)
        )
    }
    if (routeController.getById) {
        app.get(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.getById)
        )
    }
    if (routeController.create){
        app.post(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.create)
        )
    }
    if(routeController.update){
        app.put(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.update)
        )
    }
    if(routeController.removeById) {
        app.delete(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.removeById)
        )
    }
    if(routeController.removeAll) {
        app.delete(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.removeAll)
        )
    }
}

// Nuevas rutas específicas
app.get('/api/localidades/provincia/:id', makeHandlerAwareOfAsyncErrors(routes.localidades.getByProvincia));
app.get('/api/restaurants/filter', makeHandlerAwareOfAsyncErrors(routes.restaurants.getByProvinciaAndLocalidad));

app.post('/api/logincliente', makeHandlerAwareOfAsyncErrors(routes.clientes.login))
app.post('/api/loginrestaurant', makeHandlerAwareOfAsyncErrors(routes.restaurants.login))

app.post('/api/restaurants/:id/upload-image', upload.single('imagen'), async (req, res) => {
    try {
        const restaurant = await models.Restaurant.findByPk(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant no encontrado' });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
        }

        const imageName = req.file.filename;
        await restaurant.update({ imagen: imageName });

        res.json({ 
            message: 'Imagen subida exitosamente',
            imagePath: `/uploads/${imageName}`
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir la imagen', error: error.message });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;