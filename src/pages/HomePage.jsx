import CurrencyConverter from '../components/CurrencyConverter';
import ExchangeRates from '../components/ExchangeRates';
import ExchangeRateChart from '../components/ExchangeRateChart';
import { useState } from 'react';
import './HomePage.css'

const HomePage = () => { 
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  
  const handleFromCurrencyChange = (currency) => {
    setFromCurrency(currency);
  };
  
  const handleToCurrencyChange = (currency) => {
    setToCurrency(currency);
  };

  return (
    <div className='home-page'>
      <section className='hero-section'>
        <h1>Welcome to CurrencySwap</h1>
        <p>Your one stop for currency exchange rates and conversions</p>
      </section>

      <div className='content-grid'>
        <section className='converter-section'>
          <CurrencyConverter 
            onFromCurrencyChange={handleFromCurrencyChange}
            onToCurrencyChange={handleToCurrencyChange}
            initialFromCurrency={fromCurrency}
            initialToCurrency={toCurrency}
          />
          <ExchangeRateChart 
            fromCurrency={fromCurrency} 
            toCurrency={toCurrency} 
          />
        </section>
        <section className='rates-section'>
          <ExchangeRates />
        </section>
      </div>
    </div>
  );
};

export default HomePage;