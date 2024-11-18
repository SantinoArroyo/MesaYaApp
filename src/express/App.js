const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer')
const path = require("path");

const upload = multer({ dest: 'uploads/' });

const routes = {
    bebidas: require('./routes/Bebidas'),
    clientes: require('./routes/Clientes'),
    mesas: require('./routes/Mesas'),
    pagos: require('./routes/Pagos'),
    platos: require('./routes/Platos'),
    reservas: require('./routes/Reservas'),
    restaurants: require('./routes/Restaurants')
}

const app = express();
app.use(cors())

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

app.post('/api/loginrestaurant', makeHandlerAwareOfAsyncErrors(routes.restaurants.login));
app.get('/api/restaurants/:id/reservations', makeHandlerAwareOfAsyncErrors(routes.restaurants.getReservationsByRestaurantId));
app.get('/api/restaurants/:id/mesas', makeHandlerAwareOfAsyncErrors(routes.mesas.getByRestaurantId));
app.get('/api/restaurants/:id/platos', makeHandlerAwareOfAsyncErrors(routes.platos.getByRestaurantId));
app.get('/api/restaurants/:id/bebidas', makeHandlerAwareOfAsyncErrors(routes.bebidas.getByRestaurantId));
app.get('/api/restaurants/:id/reservas', makeHandlerAwareOfAsyncErrors(routes.reservas.getByRestaurantId));


app.post('/api/logincliente', makeHandlerAwareOfAsyncErrors(routes.clientes.login))


app.post('/api/restaurants/:id/upload-image', upload.single("imagen"), makeHandlerAwareOfAsyncErrors(routes.restaurants.uploadImage));

module.exports = app;