function applyExtraSetup(sequelize) {
    const { Restaurant, Plato, Bebida, Pago, Mesa, Cliente, Reserva} = sequelize.models

    Pago.hasMany(Reserva, { foreignKey: 'idPago' });
    Reserva.belongsTo(Pago, { foreignKey: 'idPago' });

    Mesa.hasMany(Reserva, { foreignKey: 'idMesa' });
    Reserva.belongsTo(Mesa, { foreignKey: 'idMesa' });

    Cliente.hasMany(Reserva, { foreignKey: 'idCliente' });
    Reserva.belongsTo(Cliente, { foreignKey: 'idCliente' });

    Restaurant.hasMany(Reserva, { foreignKey: 'idRestaurant' });
    Reserva.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });

    Restaurant.hasMany(Plato, { foreignKey: 'idRestaurant' });
    Plato.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });

    Restaurant.hasMany(Bebida, { foreignKey: 'idRestaurant' });
    Bebida.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });
};

module.exports = {applyExtraSetup}