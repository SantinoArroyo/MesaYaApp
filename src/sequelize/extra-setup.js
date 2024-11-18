function applyExtraSetup(sequelize) {
    const { Restaurant, Plato, Bebida, Pago, Mesa, Cliente, Reserva } = sequelize.models;

    // Definir relaciones
    Restaurant.hasMany(Reserva, { foreignKey: 'idRestaurant' });
    Reserva.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });

    Cliente.hasMany(Reserva, { foreignKey: 'idCliente' });
    Reserva.belongsTo(Cliente, { foreignKey: 'idCliente' });

    Mesa.hasMany(Reserva, { foreignKey: 'idMesa' });
    Reserva.belongsTo(Mesa, { foreignKey: 'idMesa' });

    Pago.hasMany(Reserva, { foreignKey: 'idPago' });
    Reserva.belongsTo(Pago, { foreignKey: 'idPago' });

    Restaurant.hasMany(Mesa, { foreignKey: 'idRestaurant' });
    Mesa.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });

    Restaurant.hasMany(Plato, { foreignKey: 'idRestaurant' });
    Plato.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });

    Restaurant.hasMany(Bebida, { foreignKey: 'idRestaurant' });
    Bebida.belongsTo(Restaurant, { foreignKey: 'idRestaurant' });
}

module.exports = { applyExtraSetup };