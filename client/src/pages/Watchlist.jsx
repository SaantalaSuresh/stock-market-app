

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Watchlist.css'; // Import the CSS file
import { format } from 'date-fns'; // Import date-fns for date formatting

const Watchlist = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newStock, setNewStock] = useState({ name: '', symbol: '', datetime: '' });
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  if(!userId){
    alert("Please Sign In");
    navigate('/sign-in');
  }
  


  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/watchlist/${userId}`);
      setStocks(response.data);
    } catch (error) {
      setError('Failed to fetch watchlist');
      
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    setLoading(true);
    setError(null);
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
      fetchWatchlist();
      setShowModal(false);
    } catch (error) {
      setError('Failed to add stock');
      toast.error('Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`/api/watchlist/${selectedStock._id}`, {
        userId,
        updatedStock: {
          ...newStock,
          datetime: selectedStock.datetime // Keep existing datetime
        }
      });
      toast.success('Stock updated successfully');
      setShowModal(false);
      setNewStock({ name: '', symbol: '', datetime: '' })
      fetchWatchlist();
    } catch (error) {
      setError('Failed to update stock');
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (stockId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete('/api/watchlist', { data: { userId, stockId } });
      toast.success('Stock removed successfully');
      fetchWatchlist();
    } catch (error) {
      setError('Failed to remove stock');
      toast.error('Failed to remove stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="watchlist-container">
      <h1 className="watchlist-title">My Watchlist</h1>
      <Button className="btn-add-stock" onClick={() => { setIsEditing(false); setShowModal(true); }}>
        Add Stock
      </Button>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {stocks.length === 0 && !loading && <p className="empty-message">Your watchlist is empty.</p>}
      <Table striped bordered hover responsive>
        <thead>
          <tr >
            <th>timeZone</th>
            <th>Symbol</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock._id}>
              <td>{stock.name}</td>
              <td>{stock.symbol}</td>
              <td>{format(new Date(stock.datetime), 'MMMM d, yyyy H:mm')}</td>
              <td>
                <Button variant="outline-warning" onClick={() => { setSelectedStock(stock); setNewStock({ name: stock.name, symbol: stock.symbol, datetime: stock.datetime }); setIsEditing(true); setShowModal(true); }}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" onClick={() => handleDeleteStock(stock._id)} className="ms-2">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding or updating stocks */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Update Stock' : 'Add Stock'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStockName">
              <Form.Label>timeZone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter stock name"
                value={newStock.name}
                onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formStockSymbol">
              <Form.Label>Symbol</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter stock symbol"
                value={newStock.symbol}
                onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={isEditing ? handleUpdateStock : handleAddStock}>
              {isEditing ? 'Update Stock' : 'Add Stock'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Watchlist;
