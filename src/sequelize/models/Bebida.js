const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Bebida', {
        idBebida: {
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
        idRestaurant: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Restaurants',
                key: 'idRestaurant'
            }
        }
    }, {
        tableName: 'Bebida',
        timestamps: true
    });
};