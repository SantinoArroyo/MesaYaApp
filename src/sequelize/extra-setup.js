function applyExtraSetup(sequelize) {
    const {Carta, Restaurant, Plato, Bebida, Pago, Mesa, Cliente, Reserva, Provincia, Localidad} = sequelize.models

    Restaurant.hasOne(Carta, { foreignKey: 'idRestaurant' });
    Carta.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });

    Pago.hasMany(Reserva, { foreignKey: 'idPago' });
    Reserva.belongsTo(Pago, { foreignKey: 'idPago' });

    Mesa.hasMany(Reserva, { foreignKey: 'idMesa' });
    Reserva.belongsTo(Mesa, { foreignKey: 'idMesa' });

    Cliente.hasMany(Reserva, { foreignKey: 'idCliente' });
    Reserva.belongsTo(Cliente, { foreignKey: 'idCliente' });

    Restaurant.hasMany(Reserva, { foreignKey: 'idRestaurant' });
    Reserva.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });

    Carta.belongsToMany(Plato, { through: 'CartaPlato', foreignKey: 'idCarta' });
    Carta.belongsToMany(Bebida, { through: 'CartaBebida', foreignKey: 'idCarta' });
    
    Provincia.hasMany(Localidad, { foreignKey: 'idProvincia' });
    Localidad.belongsTo(Provincia, { foreignKey: 'idProvincia' });

    Provincia.hasMany(Restaurant, { foreignKey: 'idProvincia' });
    Restaurant.belongsTo(Provincia, { foreignKey: 'idProvincia' });

    Localidad.hasMany(Restaurant, { foreignKey: 'idLocalidad' });
    Restaurant.belongsTo(Localidad, { foreignKey: 'idLocalidad' });

    Provincia.hasMany(Cliente, { foreignKey: 'idProvincia'})
    Cliente.belongsTo(Provincia, { foreignKey: 'idProvincia'})

    Localidad.hasMany(Cliente, {foreignKey: 'idLocalidad'})
    Cliente.belongsTo(Localidad, {foreignKey: 'idLocalidad'})
};

module.exports = {applyExtraSetup}