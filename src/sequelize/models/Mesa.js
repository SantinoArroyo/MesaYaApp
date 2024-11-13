const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Mesa', {
        idMesa: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        numero: DataTypes.INTEGER,
        estado: DataTypes.STRING,
        cantidadPersonas: DataTypes.INTEGER,
    },{
        tableName: 'Mesa',
        timestamps: false
    });
};