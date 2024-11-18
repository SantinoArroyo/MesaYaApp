const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Cliente', {
        idCliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull:false
        },
        apellido:{
            type: DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull:false
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull:false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull:false
        }
        }, {
            tableName: 'Cliente',
            timestamps: true
        });
};