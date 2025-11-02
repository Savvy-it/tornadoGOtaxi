
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { LightningIcon, ShieldIcon } from '../components/icons';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">
      <header className="px-4 py-5 sm:px-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LightningIcon className="h-8 w-8 text-brand-purple" />
            <span className="text-2xl font-bold">Tornado Taxi</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-semibold hover:text-brand-purple-light transition">Sign In</Link>
            <Button variant="primary" className="!w-auto" onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </nav>
      </header>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            Your Ride,
            <br />
            <span className="text-brand-purple">Lightning Fast</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-text-secondary mb-8">
            Book a ride in seconds or earn driving with Tornado Taxi. Safe, reliable, and always available.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" onClick={() => navigate('/book')}>Book a Ride</Button>
            <Button variant="secondary" onClick={() => navigate('/login')}>Become a Driver</Button>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full">
          <div className="flex flex-col items-center">
            <div className="bg-brand-dark-light p-4 rounded-full mb-4">
              <LightningIcon className="h-10 w-10 text-brand-purple" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-brand-text-secondary">Get matched with drivers in seconds</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-brand-dark-light p-4 rounded-full mb-4">
                <ShieldIcon className="h-10 w-10 text-brand-purple" />
            </div>
            <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
            <p className="text-brand-text-secondary">Real-time tracking and verified drivers</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;