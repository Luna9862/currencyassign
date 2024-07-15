document.addEventListener('DOMContentLoaded', () => {     // Get references to DOM elements
  const baseCurrencySelect = document.getElementById('baseCurrency');
  const targetCurrencySelect = document.getElementById('targetCurrency');
  const amountInput = document.getElementById('amount');
  const convertButton = document.getElementById('convert');
  const convertedAmountDisplay = document.getElementById('convertedAmount');
  const historicalRatesButton = document.getElementById('historicalRates');
  const historicalRateDisplay = document.getElementById('historicalRate');
  const saveFavoriteButton = document.getElementById('saveFavorite');
  const favoritePairsList = document.getElementById('favoritePairs');

  // Populate currency dropdowns
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY','BGN','CZK','DKK','HUF','PLN','RON','SEK','BRL','NOK','THB','MXN','KRW','MYR','ZAR','PHP'];
  currencies.forEach(currency => {
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');
    option1.value = option2.value = currency;
    option1.text = option2.text = currency;
    baseCurrencySelect.add(option1);
    targetCurrencySelect.add(option2);
  });

  // Fetch and display converted amount
  convertButton.addEventListener('click', async () => {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    const amount = amountInput.value;
    if (amount && baseCurrency && targetCurrency) {
      try {    // Fetch current exchange rate data from the server
        const response = await fetch(`/api/exchange-rate/${baseCurrency}`);
        const data = await response.json();
        const rate = data.data[targetCurrency];
        const convertedAmount = (amount * rate).toFixed(2); // Calculate converted amount with two decimal places
        convertedAmountDisplay.textContent = `${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`;
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    }
  });

  // Fetch and display historical rate
  historicalRatesButton.addEventListener('click', async () => {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    const date = '2023-01-01'; //  Example date for historical rates
    try {       // Fetch historical exchange rate data from the server
      const response = await fetch(`/api/historical-rate/${baseCurrency}/${targetCurrency}/${date}`);
      const data = await response.json();
      console.log(data); // Log the response to debug
      const rate = data.data[date][targetCurrency]; // Access the correct rate
      historicalRateDisplay.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
    } catch (error) {
      console.error('Error fetching historical rate:', error);
    }
  });

  // Save favorite pair
  saveFavoriteButton.addEventListener('click', async () => {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    try {    // Save the favorite currency pair on the server
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ baseCurrency, targetCurrency })
      });
      const favoritePair = await response.json();
            // Create a new list item for the saved favorite pair and add click listener to select it
      const listItem = document.createElement('li');
      listItem.textContent = `${favoritePair.baseCurrency}/${favoritePair.targetCurrency}`;
      listItem.addEventListener('click', () => {
        baseCurrencySelect.value = favoritePair.baseCurrency;
        targetCurrencySelect.value = favoritePair.targetCurrency;
      });
      favoritePairsList.appendChild(listItem);
    } catch (error) {
      console.error('Error saving favorite pair:', error);
    }
  });

  // Load favorite pairs
  const loadFavoritePairs = async () => {
    try {       // Fetch all favorite pairs from the server
      const response = await fetch('/api/favorites');
      const favoritePairs = await response.json();   // Iterate through each favorite pair and create a list item with click listener to select it
      favoritePairs.forEach(pair => {
        const listItem = document.createElement('li');
        listItem.textContent = `${pair.baseCurrency}/${pair.targetCurrency}`;
        listItem.addEventListener('click', () => {
          baseCurrencySelect.value = pair.baseCurrency;
          targetCurrencySelect.value = pair.targetCurrency;
        });       // Add the new favorite pair to the favorites list in the UI
        favoritePairsList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error loading favorite pairs:', error);
    }
  };

  loadFavoritePairs();
});
