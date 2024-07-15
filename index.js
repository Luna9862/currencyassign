const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const FavoritePair = sequelize.define('FavoritePair', {
  baseCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync();

module.exports = {
  sequelize,
  FavoritePair
};
