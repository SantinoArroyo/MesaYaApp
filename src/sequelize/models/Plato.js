const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Plato', {
        idPlato: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: DataTypes.STRING,
        precio: DataTypes.FLOAT,
        descripcion: DataTypes.STRING,
        categoria: DataTypes.STRING
    }, {
        tableName: 'Plato',
        timestamps: true
    });
};