



import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import TradingViewWidget from 'react-tradingview-widget';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

const ALPHA_VANTAGE_API_KEY = 'HHSZGUD5RLRR7AOY'; // Replace with your API key CD5APXP15BV41R7L HHSZGUD5RLRR7AOY

function Home() {
    const [stockData, setStockData] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [newStock, setNewStock] = useState({ name: '', symbol: '', datetime: '' });
    const [portfolio, setPortfolio] = useState([]);
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);

    const fetchStockData = async (symbol) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            console.log('API Response:', response.data); // Log the entire response for debugging
            const data = response.data['Time Series (Daily)'];
            const result =(response.data["Meta Data"])
            console.log(result)
            const {
                "1. Information": information,
                "2. Symbol": symbolName,
                "3. Last Refreshed": lastRefreshed,
                "4. Output Size": outputSize,
                "5. Time Zone": timeZone
              } = result;
              
              // Display the destructured data
              console.log('Information:', information);
              console.log('Symbol:', symbolName);
              console.log('Last Refreshed:', lastRefreshed);
              console.log('Output Size:', outputSize);
              console.log('Time Zone:', timeZone);
              setNewStock({ name: timeZone, symbol: selectedStock.label, datetime: new Date().toISOString() })
           
            if (data) {
                const formattedData = Object.entries(data).map(([date, values]) => ({
                    date,
                    open: values['1. open'],
                    high: values['2. high'],
                    low: values['3. low'],
                    close: values['4. close'],
                    volume: values['5. volume'],
                }));
                setStockData(formattedData);
                setLoading(false);
            } else {
                setLoading(false);
                toast.error('No data available for this symbol.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching stock data:', error);
            toast.error('Failed to fetch stock data.');
        }
    };

    const handleStockSelect = (selectedOption) => {
        setSelectedStock(selectedOption);
        fetchStockData(selectedOption.value);
    };

    const handleBuyStock = () => {
        if(!userId){
            alert("Please Sign In");
           
            return
          }
        if (selectedStock && stockData.length > 0) {
            const stockExists = portfolio.some(stock => stock.symbol === selectedStock.value);
            if (!stockExists) {
                setPortfolio([...portfolio, { symbol: selectedStock.label, data: stockData[0] }]);
                toast.success(`Bought ${selectedStock.value} successfully!`);
            } else {
                toast.error(`${selectedStock.label} is already in your portfolio.`);
            }
        } else {
            toast.error('Select a stock and ensure data is loaded before buying.');
        }
    };

    const handleSellStock = (symbol) => {
        setPortfolio(portfolio.filter(stock => stock.symbol !== symbol));
        toast.success(`Sold ${symbol} successfully!`);
    };

    const handleAddToWatchlist = async () => {
        setLoading(true);
        if(!userId){
            alert("Please Sign In");
           
            return
          }
          
    
    try {
      await axios.post('/api/watchlist', {
        userId,
        stock: {
          ...newStock,
          datetime: new Date().toISOString() // Add current datetime
        }
      });
      toast.success('Stock added successfully');
      setNewStock({ name: '', symbol: '', datetime: '' });
     
      
    } catch (error) {
      
      toast.error('Failed to add stock');
    } finally {
      setLoading(false);
    }
    };

    const loadOptions = useCallback(async (inputValue) => {
        if (!inputValue) {
            return [];
        }

        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            const matches = response.data.bestMatches || [];
            console.log(matches)
            return matches.map(match => ({
                label: `${match['2. name']} (${match['1. symbol']})`,
                value: match['1. symbol'],
            }));
        } catch (error) {
            console.error('Error fetching stock options:', error);
            toast.error('Failed to fetch stock options.');
            return [];
        }
    }, []);

    return (
        <div className="stock-app">
            <h1>Stock Market Application</h1>
            
            <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                onChange={handleStockSelect}
                placeholder="Search for a stock..."
                className="stock-select"
            />

            {loading && <p>Loading stock data...</p>}
            {!userId && <button className="sign-in-button"><Link to="/sign-in">Sign In</Link></button>}
            {selectedStock && stockData.length > 0 && (
                <div className="stock-details">
                    <h2>{selectedStock.label}</h2>
                    <div className="buttons">
                        <button onClick={handleBuyStock} className="buy-button">Buy</button>
                        <button onClick={handleAddToWatchlist} className="watchlist-button">Add to Watchlist</button>
                    </div>
                    <div className="tradingview-widget">
                        <TradingViewWidget
                            symbol={selectedStock.value}
                            autosize
                            theme="light"
                        />
                    </div>
                    <div className="stock-data">
                        <h3>Historical Data</h3>
                        <ul>
                            {stockData.slice(0, 5).map((entry, index) => (
                                <li key={index}>
                                    <strong>{entry.date}:</strong> Open {entry.open}, Close {entry.close}, High {entry.high}, Low {entry.low}, Volume {entry.volume}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

           {userId &&  <div className="portfolio">
                <h3>Your Portfolio</h3>
                <ul>
                    {portfolio.length > 0 ? (
                        portfolio.map((stock, index) => (
                            <li key={index}>
                                <strong>{stock.symbol}:</strong> Last Close {stock.data.close} USD
                                <button onClick={() => handleSellStock(stock.symbol)} className="sell-button">Sell</button>
                            </li>
                        ))
                    ) : (
                        <p>No stocks in your portfolio.</p>
                    )}
                </ul>
            </div>}
            <ToastContainer />
        </div>
    );
}

export default Home;
