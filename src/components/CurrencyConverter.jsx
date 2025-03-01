import { useState, useEffect } from 'react';
import CurrencySelector from './CurrencySelector';
import { getExchangeRates, fallbackRates } from '../services/currencyService';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [amount, exchangeRate]);

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    try {
      const data = await getExchangeRates(fromCurrency);
      
      if (data.success && data.rates[toCurrency]) {
        setExchangeRate(data.rates[toCurrency]);
      } else {
        console.error('Error in API response or rate not found:', data);
        
        if (fallbackRates[fromCurrency] && fallbackRates[toCurrency]) {
          setExchangeRate(fallbackRates[toCurrency] / fallbackRates[fromCurrency]);
        } else {
          setExchangeRate(1); 
        }
      }
    } catch (error) {
      console.error('Error fetching exchange rate, using fallback:', error);
      
      if (fallbackRates[fromCurrency] && fallbackRates[toCurrency]) {
        setExchangeRate(fallbackRates[toCurrency] / fallbackRates[fromCurrency]);
      } else {
        setExchangeRate(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value === '' ? 0 : parseFloat(value));
    }
  };

  const handleFromCurrencyChange = (currency) => {
    setFromCurrency(currency);
  };

  const handleToCurrencyChange = (currency) => {
    setToCurrency(currency);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvertedAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setConvertedAmount(value);
      
      if (exchangeRate) {
        setAmount((parseFloat(value) / exchangeRate).toFixed(2));
      }
    }
  };

  return (
    <div className="currency-converter">
      <h2>Currency Converter</h2>
      
      <div className="converter-form">
        <div className="input-group">
          <CurrencySelector
            selectedCurrency={fromCurrency}
            onSelectCurrency={handleFromCurrencyChange}
          />
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="amount-input"
          />
        </div>
        
        <button className="swap-button" onClick={handleSwapCurrencies}>
          ⇅
        </button>
        
        <div className="input-group">
          <CurrencySelector
            selectedCurrency={toCurrency}
            onSelectCurrency={handleToCurrencyChange}
          />
          <input
            type="text"
            value={convertedAmount}
            onChange={handleConvertedAmountChange}
            placeholder="Converted amount"
            className="amount-input"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading exchange rate...</div>
      ) : (
        <div className="exchange-rate-info">
          <p>
            {`1 ${fromCurrency} = ${exchangeRate?.toFixed(4)} ${toCurrency}`}
          </p>
          <p className="update-time">
            Updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;