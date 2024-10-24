const express = require('express');
const { sequelize } = require('./models');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rutas simples
app.get('/', (req, res) => {
  res.send('¡Backend en Express con SQLite y Sequelize!');
});

// Iniciar el servidor
app.listen(port, async () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
});
