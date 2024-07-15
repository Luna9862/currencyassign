const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const { FavoritePair} = require('./index');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));


const API_KEY = 'fca_live_MXik8dH6uun2VfClx6vu54cZtJ3qfsTGmvYxueRn';
const BASE_URL = 'https://api.freecurrencyapi.com/v1/';

// Fetch current exchange rates
app.get('/api/exchange-rate/:base', async (req, res) => {
  const base = req.params.base;
  try {
    const response = await axios.get(`${BASE_URL}latest`, {
      params: {
        apikey: API_KEY,
        base_currency: base
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

// Fetch historical exchange rates
app.get('/api/historical-rate/:base/:target/:date', async (req, res) => {
  const { base, target, date } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}historical`, {
      params: {
        apikey: API_KEY,
        base_currency: base,
        date
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch historical rates' });
  }
});

// Save favorite currency pair
app.post('/api/favorite', async (req, res) => {
  const { baseCurrency, targetCurrency } = req.body;
  try {
    const favoritePair = await FavoritePair.create({ baseCurrency, targetCurrency });
    res.json(favoritePair);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save favorite pair' });
  }
});

// Get favorite currency pairs
app.get('/api/favorites', async (req, res) => {
  try {
    const favoritePairs = await FavoritePair.findAll();
    res.json(favoritePairs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorite pairs' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
