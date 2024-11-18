const sequelize = require('./sequelize');  // Importar la instancia de Sequelize
const app = require('./express/App')
const PORT = 8000

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

    try {
        // Sincronizar los modelos con la base de datos
        await sequelize.sync({ force: true }); // Esto eliminará y recreará todas las tablas
        console.log('Database synced successfully');

        // Iniciar el servidor Express después de sincronizar la base de datos
        app.listen(PORT, () => {
            console.log(`Express server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
}

init();