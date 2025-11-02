import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/common/Button';
import { ClockIcon, LightningIcon, LocationPinIcon } from '../../components/icons';
import { RideStatus } from '../../types';

const PassengerHome: React.FC = () => {
  const { user } = useAuth();
  const { rides } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const userRides = rides.filter(r => r.passenger_id === user.id);
  const totalRides = userRides.filter(r => r.status === RideStatus.COMPLETED).length;
  const totalSpent = userRides.filter(r => r.status === RideStatus.COMPLETED).reduce((acc, ride) => acc + ride.amount, 0);
  const recentRides = userRides.slice(0, 2);

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Card */}
      <div className="bg-brand-purple text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold">Welcome back, {user.full_name}!</h1>
        <p className="opacity-80">Ready for your next adventure?</p>
      </div>

      {/* Book Ride Card */}
      <div className="bg-brand-dark-light p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-1">Book Your Ride</h2>
        <p className="text-brand-text-secondary mb-4">Get where you need to go quickly and safely</p>
        <Button variant="primary" onClick={() => navigate('/passenger/book')}>
          <div className="flex items-center justify-center gap-2">
            <LightningIcon className="h-5 w-5" />
            <span>Request a Ride Now</span>
          </div>
        </Button>
      </div>
      
      {/* Stats Card */}
      <div className="bg-brand-dark-light p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Your Stats</h2>
        <div className="flex justify-around text-center">
            <div>
                <p className="text-2xl font-bold">{totalRides}</p>
                <p className="text-brand-text-secondary text-sm">Total Rides</p>
            </div>
            <div>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                <p className="text-brand-text-secondary text-sm">Total Spent</p>
            </div>
        </div>
      </div>
      
      {/* Recent Rides */}
      <div className="bg-brand-dark-light p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Recent Rides</h2>
        <div className="space-y-4">
          {recentRides.length > 0 ? (
            recentRides.map(ride => (
              <div key={ride.id} className="bg-brand-dark p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                      <LocationPinIcon className="h-4 w-4 text-brand-purple" /> From: {ride.from_address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-text-secondary mt-1">
                      <LocationPinIcon className="h-4 w-4 text-brand-purple" /> To: {ride.to_address}
                    </div>
                  </div>
                  <span className="font-bold text-lg text-brand-purple">${ride.amount.toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 mx-auto text-brand-text-secondary mb-4" />
              <h3 className="font-bold">No rides yet.</h3>
              <p className="text-brand-text-secondary mb-4">Book your first ride!</p>
              <Button variant="primary" onClick={() => navigate('/passenger/book')} className="!w-auto">Book a Ride</Button>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-brand-dark-light p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">How it works</h2>
          <div className="space-y-4">
              <div className="flex items-start gap-4">
                  <div className="bg-brand-purple text-white font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                      <h3 className="font-semibold">Enter Location</h3>
                      <p className="text-brand-text-secondary text-sm">Tell us where you're going</p>
                  </div>
              </div>
              <div className="flex items-start gap-4">
                  <div className="bg-brand-purple text-white font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                      <h3 className="font-semibold">Confirm Ride</h3>
                      <p className="text-brand-text-secondary text-sm">Choose your ride type and confirm pickup</p>
                  </div>
              </div>
              <div className="flex items-start gap-4">
                  <div className="bg-brand-purple text-white font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                      <h3 className="font-semibold">Ride</h3>
                      <p className="text-brand-text-secondary text-sm">Your driver arrives to take you to your destination</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default PassengerHome;
