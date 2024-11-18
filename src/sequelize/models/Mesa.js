const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Mesa', {
        idMesa: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cantidadPersonas: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idRestaurant: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Restaurant',
                key: 'idRestaurant'
            }
        }
    }, {
        tableName: 'Mesa',
        timestamps: false
    });
};