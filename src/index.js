const sequelize = require('./sequelize');  // Importar la instancia de Sequelize
const app = require('./express/App');
const process = require('process');

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

    console.log(`Starting Sequelize + Express example...`);

    let port = process.env.PORT || 8000;
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${port} is in use, trying another...`);
            port++;
            server.listen(port);
        } else {
            throw error;
        }
    });
}

init();