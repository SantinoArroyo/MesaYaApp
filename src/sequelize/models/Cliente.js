const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Cliente', {
        idCliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        email: DataTypes.STRING,
        contraseña: DataTypes.STRING,
        telefono: DataTypes.STRING,
        direccion: DataTypes.STRING,
        });
};