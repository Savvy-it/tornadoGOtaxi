import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Ride, RideStatus } from '../../types';
import Button from '../../components/common/Button';
import { ClockIcon, LocationPinIcon, MessageIcon, ReceiptIcon, StarIcon } from '../../components/icons';
import { format } from 'date-fns';

const RideCard: React.FC<{ ride: Ride }> = ({ ride }) => {
  const isCompleted = ride.status === RideStatus.COMPLETED;
  const navigate = useNavigate();
  
  const getStatusChip = (status: RideStatus) => {
    switch(status) {
        case RideStatus.SCHEDULED: return <span className="text-xs font-semibold bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Scheduled</span>;
        case RideStatus.COMPLETED: return <span className="text-xs font-semibold bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Completed</span>;
        case RideStatus.ACTIVE: return <span className="text-xs font-semibold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Active</span>;
        default: return <span className="text-xs font-semibold bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">{status}</span>;
    }
  }

  const rideDate = new Date(ride.scheduled_for || ride.created_at);

  const getRelativeDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return format(date, 'MMM d');
  }

  return (
    <div className="bg-brand-dark-light p-4 rounded-xl space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-brand-text-secondary text-sm">{getRelativeDate(rideDate)}</p>
          <p className="font-bold text-lg">{format(rideDate, 'p')}</p>
        </div>
        {getStatusChip(ride.status)}
      </div>

      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <LocationPinIcon className="h-5 w-5 text-brand-purple" />
            <div className="w-px h-8 bg-brand-dark-lighter"></div>
            <LocationPinIcon className="h-5 w-5 text-brand-purple-light" />
          </div>
          <div>
            <div className="mb-2">
              <p className="text-sm text-brand-text-secondary">From</p>
              <p className="font-semibold">{ride.from_address}</p>
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary">To</p>
              <p className="font-semibold">{ride.to_address}</p>
            </div>
          </div>
        </div>
        {isCompleted && <span className="font-bold text-lg text-brand-purple-light">${ride.amount.toFixed(2)}</span>}
      </div>

      {isCompleted && ride.driver && (
        <div className="border-t border-brand-dark-lighter pt-4">
            <p className="font-semibold">{ride.driver.full_name}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-brand-text-secondary border-t border-brand-dark-lighter pt-4">
        <div className="flex items-center gap-1"><ClockIcon className="h-4 w-4" /> ~{ride.duration} min</div>
        <div>~{ride.distance} miles</div>
        {!isCompleted && <div className="font-semibold text-brand-text">~${ride.amount.toFixed(2)}</div>}
        {isCompleted && <div>{format(rideDate, 'MMM d')}</div>}
      </div>
      
      <div className="flex gap-2 pt-2">
        {isCompleted ? (
            <>
                <Button variant="secondary" className="text-sm !py-2"><StarIcon className="h-4 w-4 inline-block mr-1" />Rate</Button>
                <Button variant="secondary" className="text-sm !py-2"><ReceiptIcon className="h-4 w-4 inline-block mr-1" />Receipt</Button>
            </>
        ) : (
            <>
                <Button variant="secondary" className="text-sm !py-2" onClick={() => navigate(`/chat/${ride.id}`)}>
                  <MessageIcon className="h-4 w-4 inline-block mr-1" />Message
                </Button>
                <Button variant="secondary" className="text-sm !py-2">Details</Button>
            </>
        )}
      </div>
    </div>
  );
};


const PassengerMyRides: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const { user } = useAuth();
  const { rides } = useData();

  if (!user) return null;

  const userRides = rides.filter(r => r.passenger_id === user.id);
  const upcomingRides = userRides.filter(r => r.status === RideStatus.SCHEDULED || r.status === RideStatus.ACTIVE);
  const historyRides = userRides.filter(r => r.status === RideStatus.COMPLETED || r.status === RideStatus.CANCELED);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Rides</h1>
      <p className="text-brand-text-secondary">View your ride history and upcoming trips</p>

      {/* Tabs */}
      <div className="flex bg-brand-dark-light p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`w-1/2 py-2 rounded-md font-semibold transition ${activeTab === 'upcoming' ? 'bg-brand-purple text-white' : 'text-brand-text-secondary'}`}
        >
          Upcoming ({upcomingRides.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`w-1/2 py-2 rounded-md font-semibold transition ${activeTab === 'history' ? 'bg-brand-purple text-white' : 'text-brand-text-secondary'}`}
        >
          History ({historyRides.length})
        </button>
      </div>

      {/* Rides List */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          upcomingRides.length > 0
            ? upcomingRides.sort((a,b) => new Date(a.scheduled_for || a.created_at).getTime() - new Date(b.scheduled_for || b.created_at).getTime()).map(ride => <RideCard key={ride.id} ride={ride} />)
            : <p className="text-center text-brand-text-secondary py-8">No upcoming rides.</p>
        )}
        {activeTab === 'history' && (
          historyRides.length > 0
            ? historyRides.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(ride => <RideCard key={ride.id} ride={ride} />)
            : <p className="text-center text-brand-text-secondary py-8">No ride history.</p>
        )}
      </div>
    </div>
  );
};

export default PassengerMyRides;
