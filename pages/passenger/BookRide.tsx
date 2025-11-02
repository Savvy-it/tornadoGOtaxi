import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useData } from '../../contexts/DataContext';
import { LocationPinIcon } from '../../components/icons';

const BookRide: React.FC = () => {
  const [from, setFrom] = useState('123 Main St, Downtown');
  const [to, setTo] = useState('456 Park Ave, Uptown');
  const [loading, setLoading] = useState(false);
  const { requestRide } = useData();
  const navigate = useNavigate();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      setLoading(true);
      try {
        await requestRide(from, to);
        navigate('/passenger/my-rides');
      } catch (error) {
        alert('Failed to request ride. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter both pickup and drop-off locations.');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Book a Ride</h1>
      <p className="text-brand-text-secondary">Enter your trip details to find a driver.</p>

      <div className="bg-brand-dark-light p-6 rounded-xl">
        <form onSubmit={handleRequest} className="space-y-4">
          <Input 
            id="from"
            label="Pickup Location"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Enter pickup address"
            required
            disabled={loading}
          />
          <Input 
            id="to"
            label="Drop-off Location"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter destination address"
            required
            disabled={loading}
          />
          
          <div className="pt-4">
            <Button type="submit" variant="primary" disabled={loading}>
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Requesting...</span>
                  </>
                ) : (
                  <>
                    <LocationPinIcon className="h-5 w-5" />
                    <span>Find a Ride</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-brand-dark-light p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Recent Locations</h2>
        <ul className="space-y-2 text-brand-text-secondary">
          <li className="cursor-pointer hover:text-white transition">456 Oak Ave</li>
          <li className="cursor-pointer hover:text-white transition">789 Pine Rd</li>
        </ul>
      </div>
    </div>
  );
};

export default BookRide;
