const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Carta', {
        idCarta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: DataTypes.STRING,
    });
};