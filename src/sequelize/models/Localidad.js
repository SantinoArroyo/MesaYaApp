const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Localidad', {
        idLocalidad: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        idProvincia: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Provincia',
                key: 'idProvincia'
            }
        }
    }, {
        tableName: 'Localidad',
        timestamps: false
    });
};