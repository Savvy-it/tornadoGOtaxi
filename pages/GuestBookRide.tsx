import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useData } from '../contexts/DataContext';
import { LightningIcon, LocationPinIcon, CheckCircleIcon } from '../components/icons';

const GuestBookRide: React.FC = () => {
  const { requestRideAsGuest } = useData();
  
  const [from, setFrom] = useState('123 Main St, Downtown');
  const [to, setTo] = useState('456 Park Ave, Uptown');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!guestName || !guestEmail) {
        throw new Error('Please provide your name and email to book a ride.');
      }
      await requestRideAsGuest(from, to, guestEmail, guestName);
      setSuccess("Your ride has been requested! For your convenience, an account has been created with your email address. To access your ride history later, you can use the 'Forgot Password' feature on the login page to set a password.");
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto text-center bg-brand-dark-light rounded-xl p-8">
          <CheckCircleIcon className="h-16 w-16 mx-auto text-green-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ride Requested!</h1>
          <p className="text-brand-text-secondary mb-6">{success}</p>
          <Button variant="primary" onClick={() => navigate('/')}>Return to Homepage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Link to="/" className="flex justify-center mb-8">
            <LightningIcon className="h-10 w-10 text-brand-purple" />
        </Link>
        <div className="bg-brand-dark-light rounded-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              Book a Ride
            </h2>
            <p className="text-brand-text-secondary">
              Enter your details to book a ride without an account.
            </p>
          </div>
          
          {error && <p className="p-3 mb-4 rounded-lg text-sm text-red-400 bg-red-500/10">{error}</p>}

          <form onSubmit={handleRequest} className="space-y-4">
            <Input 
              id="guestName"
              label="Full Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={loading}
              autoComplete="name"
            />
            <Input 
              id="guestEmail"
              label="Email Address"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
            />
            <hr className="border-brand-dark-lighter" />
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

          <p className="text-center text-sm text-brand-text-secondary mt-6">
            Already have an account? <Link to="/login" className="font-semibold text-brand-purple-light hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestBookRide;