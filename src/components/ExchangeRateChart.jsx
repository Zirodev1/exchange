import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getExchangeRates, fallbackRates } from '../services/currencyService';
import './ExchangeRateChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Log Chart.js version for debugging
console.log('Chart.js version:', ChartJS.version);

const TIME_PERIODS = {
  '48 hours': { days: 2, interval: 'hour' },
  '1 week': { days: 7, interval: 'day' },
  '1 month': { days: 30, interval: 'day' },
  '6 months': { days: 180, interval: 'week' },
  '12 months': { days: 365, interval: 'month' },
  '5 years': { days: 1825, interval: 'month' }
};

const ExchangeRateChart = ({ fromCurrency, toCurrency }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1 month');

  // Function to generate historical data based on current rate
  const generateHistoricalData = (period, currentRate) => {
    if (!currentRate) return { labels: [], rates: [] };
    
    const { days } = TIME_PERIODS[period];
    const dataPoints = days <= 30 ? days : 30;
    const today = new Date();
    const labels = [];
    const rates = [];
    
    // For long term periods, add a trend
    let trendDirection = -0.05;
    if (days > 30) {
      // More pronounced trend for longer periods
      trendDirection = -0.1;
    }
    
    // Generate dates and random rates with a realistic trend
    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - Math.floor(i * (days / dataPoints)));
      
      // For longer periods, use a more compact date format
      let dateFormat = { month: 'short', day: 'numeric' };
      if (days > 180) {
        dateFormat = { month: 'short', year: '2-digit' };
      }
      
      labels.push(date.toLocaleDateString('en-US', dateFormat));
      
      
      let volatility = 0.01;
      
      
      if (currentRate >= 100) {
        volatility = 0.02; 
      } else if (currentRate < 0.1) {
        volatility = 0.005; 
      }
      
      const randomChange = (Math.random() - 0.5) * volatility;
      const trend = (i / dataPoints) * trendDirection; 
      
      // Calculate rate with trend and randomness - ensure it's positive
      const rate = Math.max(0.0001, currentRate * (1 + randomChange + trend));
      rates.push(rate);
    }
    
    return { labels, rates };
  };

  // Fetch current exchange rate and generate historical data
  useEffect(() => {
    const fetchRateAndGenerateHistory = async () => {
      setIsLoading(true);
      try {
        // Get current exchange rate from API
        const data = await getExchangeRates(fromCurrency);
        
        let rate;
        if (data && data.success && data.rates && data.rates[toCurrency]) {
          // Use API data
          rate = data.rates[toCurrency];
        } else {
          // Fallback to estimated rates
          console.warn('API data unavailable, using fallback rates');
          if (fallbackRates[fromCurrency] && fallbackRates[toCurrency]) {
            rate = fallbackRates[toCurrency] / fallbackRates[fromCurrency];
          } else {
            rate = 1.0; // Default if no fallback available
          }
        }

        console.log(`Current rate for ${fromCurrency} to ${toCurrency}: ${rate}`);
        
        // Generate historical data based on current rate
        const { labels, rates } = generateHistoricalData(selectedPeriod, rate);
        console.log("Generated data points:", rates.length);
        console.log("Sample rates:", rates.slice(0, 5));
        
        setChartData({
          labels,
          datasets: [
            {
              label: `${fromCurrency} to ${toCurrency}`,
              data: rates,
              fill: false,
              borderColor: 'var(--primary-color)',
              tension: 0.1,
              pointRadius: 1,
              borderWidth: 2
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching exchange rate data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRateAndGenerateHistory();
  }, [fromCurrency, toCurrency, selectedPeriod]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        position: 'right',
        beginAtZero: false,
        min: undefined,
        suggestedMin: undefined,
        grace: '10%',
        ticks: {
          padding: 10,
          callback: function(value) {
            if (value >= 100) {
              return value.toFixed(1);
            } else if (value < 0.1) {
              return value.toFixed(4);
            } else {
              return value.toFixed(2);
            }
          }
        }
      }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 500
    },
    elements: {
      point: {
        radius: 1,
        hitRadius: 10,
        hoverRadius: 4
      },
      line: {
        tension: 0.2
      }
    }
  };

  return (
    <div className="exchange-rate-chart">
      <div className="time-period-selector">
        <h3>Time period</h3>
        <div className="time-buttons">
          {Object.keys(TIME_PERIODS).map((period) => (
            <button
              key={period}
              className={`time-button ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-container">
        {isLoading ? (
          <div className="loading">Loading chart data...</div>
        ) : chartData.datasets[0]?.data?.length > 0 ? (
          <Line data={chartData} options={chartOptions} height={300} />
        ) : (
          <div className="loading">No data available</div>
        )}
      </div>
    </div>
  );
};

export default ExchangeRateChart; 