const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Reserva', {
        idReserva: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha: DataTypes.DATE,
        horario: DataTypes.TIME,
    }, {
        tableName: 'Reserva',
        timestamps: true
    });
};