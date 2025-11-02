import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { LocationPinIcon, StarIcon, PhoneIcon, MessageIcon, CheckCircleIcon, UserCircleIcon } from '../../components/icons';
import { useData } from '../../contexts/DataContext';
import { Ride } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const RequestCard: React.FC<{ ride: Ride }> = ({ ride }) => {
  const { acceptRide, declineRide } = useData();
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(false);
  
  if (!ride.passenger) return null; // Passenger data might not be loaded yet

  const handleAccept = async (navigate_to: boolean) => {
    setIsAccepting(true);
    try {
      await acceptRide(ride.id);
      if (navigate_to) {
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ride.from_address)}`;
        window.open(mapsUrl, '_blank');
      }
      navigate('/driver/active');
    } catch (error) {
      alert('Could not accept ride. It might have been taken by another driver.');
      console.error(error);
    } finally {
      setIsAccepting(false);
    }
  }
  
  return (
    <div className="bg-brand-dark-light p-4 rounded-xl space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <UserCircleIcon className="h-10 w-10 text-brand-text-secondary" />
          <div>
            <p className="font-semibold">{ride.passenger.full_name}</p>
            <div className="flex items-center gap-1 text-sm text-yellow-400">
              <StarIcon className="h-4 w-4" /> {ride.passenger.rating} rating
            </div>
          </div>
        </div>
        <p className="text-sm text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-md">
          {formatDistanceToNow(new Date(ride.created_at), { addSuffix: true })}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <LocationPinIcon className="h-5 w-5 text-brand-purple" />
          <div className="w-px h-8 bg-brand-dark-lighter"></div>
          <LocationPinIcon className="h-5 w-5 text-brand-purple-light" />
        </div>
        <div>
          <div className="mb-2">
            <p className="text-sm text-brand-text-secondary">Pickup</p>
            <p className="font-semibold">{ride.from_address}</p>
          </div>
          <div>
            <p className="text-sm text-brand-text-secondary">Dropoff</p>
            <p className="font-semibold">{ride.to_address}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center border-t border-brand-dark-lighter pt-4">
        <div><p className="text-sm text-brand-text-secondary">Distance</p><p className="font-semibold">{ride.distance} miles</p></div>
        <div><p className="text-sm text-brand-text-secondary">Time</p><p className="font-semibold">{ride.duration} min</p></div>
        <div><p className="text-sm text-brand-text-secondary">Fare</p><p className="font-semibold">${ride.amount.toFixed(2)}</p></div>
        <div><p className="text-sm text-brand-text-secondary">Pickup</p><p className="font-semibold">Now</p></div>
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-brand-dark-lighter">
          <a href={`tel:${ride.passenger.phone}`} className="w-full">
            <Button variant="secondary" className="!py-2 text-sm"><PhoneIcon className="h-4 w-4 inline mr-1" /> Call</Button>
          </a>
          <Button variant="secondary" className="!py-2 text-sm" onClick={() => navigate(`/chat/${ride.id}`)}><MessageIcon className="h-4 w-4 inline mr-1" /> Message</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" className="!py-2 text-sm bg-brand-purple" onClick={() => handleAccept(true)} disabled={isAccepting}>
            {isAccepting ? 'Accepting...' : <><CheckCircleIcon className="h-4 w-4 inline mr-1" /> Accept & Navigate</>}
        </Button>
        <Button variant="secondary" className="!py-2 text-sm" onClick={() => declineRide(ride.id)} disabled={isAccepting}>Decline</Button>
      </div>
    </div>
  );
};


const DriverPending: React.FC = () => {
  const { pendingRequests } = useData();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Pending Requests</h1>
      <p className="text-brand-text-secondary">
        {pendingRequests.length} request{pendingRequests.length !== 1 && 's'} waiting for acceptance
      </p>

      {pendingRequests.length > 0 ? (
        <div className="space-y-4">
            {pendingRequests.map(ride => <RequestCard key={ride.id} ride={ride} />)}
        </div>
      ) : (
        <p className="text-center text-brand-text-secondary py-16">No pending requests right now.</p>
      )}
    </div>
  );
};

export default DriverPending;
