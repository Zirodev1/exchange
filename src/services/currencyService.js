const API_URL = `https://v6.exchangerate-api.com/v6/${import.meta.env.EXCHANGERATE_API}`;

// import.meta.env.VITE_API_URL

/**
 * Fetch latest exchange rates for a base currency
 * @param {string} base - Base currency code (e.g., 'USD')
 * @returns {Promise} - Response with exchange rates
 */
export const getExchangeRates = async (base = 'USD') => {
  try {
    const response = await fetch(`${API_URL}/latest?base=${base}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

/**
 * Convert a specific amount from one currency to another
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @param {number} amount - Amount to convert
 * @returns {Promise} - Response with conversion result
 */
export const convertCurrency = async (from, to, amount) => {
  try {
    const response = await fetch(`${API_URL}/convert?from=${from}&to=${to}&amount=${amount}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

/**
 * Get a list of available currencies
 * @returns {Promise} - Response with available currencies
 */
export const getSupportedCurrencies = async () => {
  try {
    const response = await fetch(`${API_URL}/symbols`);
    const data = await response.json();
    return data.symbols;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

// Fallback data in case the API is down or rate limited
export const fallbackCurrencies = {
  USD: { description: "United States Dollar" },
  EUR: { description: "Euro" },
  GBP: { description: "British Pound Sterling" },
  JPY: { description: "Japanese Yen" },
  CAD: { description: "Canadian Dollar" },
  AUD: { description: "Australian Dollar" },
  CHF: { description: "Swiss Franc" },
  CNY: { description: "Chinese Yuan" },
  INR: { description: "Indian Rupee" },
  MXN: { description: "Mexican Peso" }
};

export const fallbackRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.05,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.41,
  MXN: 16.82
};