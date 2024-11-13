const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Provincia', {
        idProvincia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'Provincia',
        timestamps: false
    });
};