const sequelize = require('./sequelize');  // Importar la instancia de Sequelize
const app = require('./express/App')
const port = 8000

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();

    // sync models (create tables if they don't exist)
    await sequelize.sync();

	console.log(`Starting Sequelize + Express example on port ${PORT}...`);


    app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);
	});
}

init();

app.use(express.json());

// Rutas simples
app.get('/', (req, res) => {
  res.send('¡Backend en Express con SQLite y Sequelize!');
});

// Sincronización de la base de datos
sequelize.sync({ force: true })  // Sincronizar la base de datos con las tablas
  .then(() => {
    console.log('Base de datos y tablas creadas.');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
