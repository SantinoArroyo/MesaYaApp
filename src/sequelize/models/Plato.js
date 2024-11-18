const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Plato', {
        idPlato: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idRestaurant: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Restaurant', // Nombre de la tabla relacionada
                key: 'idRestaurant'
            }
        }
    }, {
        tableName: 'Plato',
        timestamps: true
    });
};