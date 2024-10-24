function applyExtraSetup(sequelize) {
    const {Carta, Restaurant, Plato, Bebida, Pago, Mesa, Cliente, Reserva} = sequelize.models

    Carta.belongsTo(models.Restaurant, { foreignKey: 'idRestaurant' });
    Carta.belongsToMany(models.Plato, { through: 'CartaPlato', foreignKey: 'idCarta' });
    Carta.belongsToMany(models.Bebida, { through: 'CartaBebida', foreignKey: 'idCarta' });

    Pago.hasMany(models.Reserva, { foreignKey: 'idPago' });

    Mesa.hasMany(models.Reserva, { foreignKey: 'idMesa' });

    Reserva.belongsTo(models.Cliente, { foreignKey: 'idCliente' });
    Reserva.belongsTo(models.Restaurant, { foreignKey: 'idRestaurant' });
    Reserva.belongsTo(models.Mesa, { foreignKey: 'idMesa' });
    Reserva.belongsTo(models.Pago, { foreignKey: 'idPago' });

    Cliente.hasMany(models.Reserva, { foreignKey: 'idCliente' });

    Restaurant.hasMany(models.Reserva, { foreignKey: 'idRestaurant' });
    Restaurant.hasOne(models.Carta, { foreignKey: 'idRestaurant' });
    
};

module.exports = {applyExtraSetup}