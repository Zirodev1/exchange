import { useState, useEffect } from 'react';
import { getSupportedCurrencies, fallbackCurrencies } from '../services/currencyService';
import './CurrencySelector.css';

const CurrencySelector = ({ selectedCurrency, onSelectCurrency, label }) => {
  const [currencies, setCurrencies] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getSupportedCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error('Error fetching currencies, using fallback data:', error);
        setCurrencies(fallbackCurrencies);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    onSelectCurrency(e.target.value);
  };

  return (
    <div className="currency-selector">
      {label && <label htmlFor="currency-select">{label}</label>}
      <select
        id="currency-select"
        value={selectedCurrency}
        onChange={handleChange}
        disabled={isLoading}
      >
        {isLoading ? (
          <option>Loading currencies...</option>
        ) : (
          Object.entries(currencies).map(([code, { description }]) => (
            <option key={code} value={code}>
              {code} - {description}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default CurrencySelector;