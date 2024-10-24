const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Bebida', {
        idBebida: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: DataTypes.STRING,
        precio: DataTypes.FLOAT,
        descripcion: DataTypes.STRING,
    });
};