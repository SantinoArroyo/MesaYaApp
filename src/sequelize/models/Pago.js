const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Pago', {
        idPago: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        monto: DataTypes.FLOAT,
        fecha: DataTypes.DATE,
    });
};