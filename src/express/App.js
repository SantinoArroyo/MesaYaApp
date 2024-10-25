const express = require('express');
const bodyParser = require('body-parser');

const routes = {
    bebidas: require('./routes/Bebidas'),
    cartas: require('./routes/Cartas'),
    clientes: require('./routes/Clientes'),
    mesas: require('./routes/Mesas'),
    pagos: require('./routes/Pagos'),
    platos: require('./routes/Platos'),
    reservas: require('./routes/Reservas'),
    restaurants: require('./routes/Restaurants')
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    if(routeController.remove) {
        app.delete(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		)
    }
}

module.exports = app;