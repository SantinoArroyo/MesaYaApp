function applyExtraSetup(sequelize) {
    const {Carta, Restaurant, Plato, Bebida, Pago, Mesa, Cliente, Reserva} = sequelize.models

    Carta.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });
    Carta.belongsToMany(Plato, { through: 'CartaPlato', foreignKey: 'idCarta' });
    Carta.belongsToMany(Bebida, { through: 'CartaBebida', foreignKey: 'idCarta' });

    Pago.hasMany(Reserva, { foreignKey: 'idPago' });

    Mesa.hasMany(Reserva, { foreignKey: 'idMesa' });

    Reserva.belongsTo(Cliente, { foreignKey: 'idCliente' });
    Reserva.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });
    Reserva.belongsTo(Mesa, { foreignKey: 'idMesa' });
    Reserva.belongsTo(Pago, { foreignKey: 'idPago' });

    Cliente.hasMany(Reserva, { foreignKey: 'idCliente' });

    Restaurant.hasMany(Reserva, { foreignKey: 'idRestaurant' });
    Restaurant.hasOne(Carta, { foreignKey: 'idRestaurant' });
    
};

module.exports = {applyExtraSetup}