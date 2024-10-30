const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Restaurant', {
        idRestaurant: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: DataTypes.STRING,
        email: DataTypes.STRING,
        direccion: DataTypes.STRING,
        contraseña: DataTypes.STRING,
        telefono: DataTypes.STRING,
        categoria: DataTypes.STRING,
        CUIT: DataTypes.STRING,
        idProvincia: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idLocalidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};