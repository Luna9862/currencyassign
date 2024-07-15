// Import Sequelize and DataTypes from the sequelize package
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with SQLite as the dialect and specify the database file location
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'// Path to the SQLite database file
});

// Define a model named FavoritePair in Sequelize, which represents a table in the database
const FavoritePair = sequelize.define('FavoritePair', {
  baseCurrency: {
    type: DataTypes.STRING,// Data type for base currency, in this case, a string
    allowNull: false
  },
  targetCurrency: {
    type: DataTypes.STRING, // Data type for base currency, in this case, a string
    allowNull: false
  }
});

// Synchronize the model with the database. This creates the table if it doesn't exist.
sequelize.sync();


// Export the sequelize instance and the FavoritePair model for use in other parts of the application
module.exports = {
  sequelize,
  FavoritePair
};
