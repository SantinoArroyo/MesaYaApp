const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Restaurant', {
        idRestaurant: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull:false
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull:false
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull:false
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull:false
        },
        cuit: {
            type: DataTypes.STRING,
            allowNull:false
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });
};