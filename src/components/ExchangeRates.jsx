import { useState, useEffect } from 'react';
import CurrencySelector from './CurrencySelector';
import { getExchangeRates, fallbackRates } from '../services/currencyService';
import './ExchangeRates.css';

const ExchangeRates = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRates(baseCurrency);
  }, [baseCurrency]);

  const fetchRates = async (base) => {
    setIsLoading(true);
    try {
      const data = await getExchangeRates(base);
      
      if (data.success) {
        setRates(data.rates);
        setLastUpdated(new Date(data.date).toLocaleDateString());
      } else {
        console.error('Error in API response:', data);
        setRates(fallbackRates);
        setLastUpdated(new Date().toLocaleDateString());
      }
    } catch (error) {
      console.error('Error fetching rates, using fallback data:', error);
      setRates(fallbackRates);
      setLastUpdated(new Date().toLocaleDateString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleBaseCurrencyChange = (currency) => {
    setBaseCurrency(currency);
  };

  return (
    <div className="exchange-rates">
      <div className="exchange-rates-header">
        <h2>Exchange Rates</h2>
        <CurrencySelector
          selectedCurrency={baseCurrency}
          onSelectCurrency={handleBaseCurrencyChange}
          label="Base Currency:"
        />
      </div>
      
      {isLoading ? (
        <div className="loading">Loading exchange rates...</div>
      ) : (
        <>
          <div className="rates-table">
            <div className="table-header">
              <span>Currency</span>
              <span>Rate</span>
            </div>
            <div className="table-body">
              {Object.entries(rates)
                .filter(([currency]) => currency !== baseCurrency)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([currency, rate]) => (
                  <div key={currency} className="table-row">
                    <span className="currency-code">{currency}</span>
                    <span className="currency-rate">{rate.toFixed(4)}</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="last-updated">
            <p>Last Updated: {lastUpdated}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ExchangeRates;