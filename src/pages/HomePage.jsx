import CurrencyConverter from '../components/CurrencyConverter';
import ExchangeRates from '../components/ExchangeRates';
import './HomePage.css'

const HomePage = () => { 
  return (
    <div className='home-page'>
      <section className='hero-section'>
        <h1>Welcome to CurrencySwap</h1>;
        <p>You one stop for currency exchange rates and conversions</p>
      </section>

      <div className='content-grid'>
        <section className='converter-section'>
          <CurrencyConverter />
        </section>
        <section className='rates-section'>
          <ExchangeRates />
        </section>
      </div>
    </div>
  );
};

export default HomePage;