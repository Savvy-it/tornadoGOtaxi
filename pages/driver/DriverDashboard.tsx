import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { isToday } from 'date-fns';
import { RideStatus } from '../../types';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { rides, pendingRequests, getActiveRide } = useData();
  const activeRide = getActiveRide();

  if(!user) return null;

  const completedRides = rides.filter(r => r.driver_id === user.id && r.status === RideStatus.COMPLETED);
  const todaysCompletedRides = completedRides.filter(r => isToday(new Date(r.created_at)));
  
  const todaysEarnings = todaysCompletedRides.reduce((acc, ride) => acc + ride.amount, 0);
  const completedTrips = todaysCompletedRides.length;

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Card */}
      <div className="bg-brand-purple text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold">Welcome back, {user.full_name}!</h1>
        <p className="opacity-80">You're online and ready to accept rides</p>
      </div>

      {/* Today's Earnings */}
      <div className="bg-brand-dark-light p-6 rounded-xl">
        <p className="text-brand-text-secondary mb-1">Today's Earnings</p>
        <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-white">${todaysEarnings.toFixed(2)}</p>
            {/* Percentage change is hard without historical data, so we'll omit it for now */}
        </div>
        <p className="text-sm text-brand-text-secondary mt-1">From {completedTrips} completed trips</p>
      </div>
      
      {/* Pending Requests */}
      <Link to="/driver/pending" className="block bg-brand-dark-light p-6 rounded-xl hover:bg-brand-dark-lighter transition">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-brand-text-secondary">Pending Requests</p>
                <p className="text-3xl font-bold text-white">{pendingRequests.length}</p>
                <p className="text-sm text-brand-text-secondary mt-1">Waiting for acceptance</p>
            </div>
            <span className="text-brand-purple font-semibold">View</span>
        </div>
      </Link>

      {/* Active Trips */}
      <Link to="/driver/active" className="block bg-brand-dark-light p-6 rounded-xl hover:bg-brand-dark-lighter transition">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-brand-text-secondary">Active Trips</p>
                <p className="text-3xl font-bold text-white">{activeRide ? 1 : 0}</p>
                <p className="text-sm text-brand-text-secondary mt-1">Currently in progress</p>
            </div>
            <span className="text-brand-purple font-semibold">View</span>
        </div>
      </Link>
    </div>
  );
};

export default DriverDashboard;
