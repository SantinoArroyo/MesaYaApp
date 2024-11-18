const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Reserva', {
        idReserva: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        horario: {
            type: DataTypes.TIME,
            allowNull: false
        },
        idMesa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Mesa',
                key: 'idMesa'
            }
        },
        idCliente: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cliente',
                key: 'idCliente'
            }
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
        tableName: 'Reserva',
        timestamps: true
    });
};