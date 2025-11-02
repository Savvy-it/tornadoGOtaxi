import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { LocationPinIcon, PhoneIcon, MessageIcon, StarIcon, CheckCircleIcon, ExclamationIcon, UserCircleIcon } from '../../components/icons';
import { useData } from '../../contexts/DataContext';

const DriverActiveRide: React.FC = () => {
    const { getActiveRide } = useData();
    const navigate = useNavigate();
    const activeRide = getActiveRide();

    if (!activeRide || !activeRide.passenger) {
        return (
            <div className="p-4 text-center">
                <p className="text-brand-text-secondary mt-8">No active ride at the moment.</p>
            </div>
        );
    }
    
    const { passenger, from_address, to_address, amount } = activeRide;

    const passengerInitials = (passenger.full_name.split(' ')[0]?.[0] || '') + (passenger.full_name.split(' ')[1]?.[0] || '');

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Active Ride</h1>
            
            {/* Route Map */}
            <div className="bg-brand-dark-light p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Route Map</h2>
                <div className="aspect-video bg-brand-dark rounded-lg flex items-center justify-center">
                    <div className="text-center text-brand-text-secondary">
                        <LocationPinIcon className="h-12 w-12 mx-auto" />
                        <p>Live map view will appear here</p>
                    </div>
                </div>
            </div>

            {/* Route Details */}
            <div className="bg-brand-dark-light p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Route Details</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <LocationPinIcon className="h-6 w-6 text-brand-purple mt-1" />
                        <div>
                            <p className="text-sm text-brand-text-secondary">Pickup Location</p>
                            <p className="font-semibold">{from_address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <LocationPinIcon className="h-6 w-6 text-brand-purple-light mt-1" />
                        <div>
                            <p className="text-sm text-brand-text-secondary">Dropoff Location</p>
                            <p className="font-semibold">{to_address}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Passenger Info */}
            <div className="bg-brand-dark-light p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Passenger Info</h2>
                <div className="flex items-center gap-4">
                    <div className="bg-brand-purple text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl">
                        {passengerInitials.toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{passenger.full_name}</p>
                        <div className="flex items-center gap-1 text-sm text-yellow-400">
                           <StarIcon className="h-4 w-4" /> {passenger.rating || 'N/A'} rating
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <a href={`tel:${passenger.phone}`} className="w-full">
                        <Button variant="secondary" className="!py-2 text-sm"><PhoneIcon className="h-4 w-4 inline mr-1" /> Call</Button>
                    </a>
                    <Button variant="secondary" className="!py-2 text-sm" onClick={() => navigate(`/chat/${activeRide.id}`)}>
                        <MessageIcon className="h-4 w-4 inline mr-1" /> Message
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-brand-dark-light p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Actions</h2>
                <div className="space-y-3">
                    <Button variant="primary"><CheckCircleIcon className="h-5 w-5 inline mr-2" /> Passenger Arrived</Button>
                    <Button variant="secondary"><ExclamationIcon className="h-5 w-5 inline mr-2" /> Report Issue</Button>
                </div>
            </div>

            {/* Earnings */}
            <div className="bg-brand-dark-light p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Earnings</h2>
                <div className="space-y-2 text-brand-text-secondary">
                    <div className="flex justify-between"><p>Base Fare</p><p className="text-brand-text">$8.00</p></div>
                    <div className="flex justify-between"><p>Distance ($2.50/mi)</p><p className="text-brand-text">$3.20</p></div>
                    <div className="flex justify-between"><p>Time ($0.45/min)</p><p className="text-brand-text">$0.90</p></div>
                    <div className="border-t border-brand-dark-lighter my-2"></div>
                    <div className="flex justify-between font-bold"><p>Total Earnings</p><p className="text-brand-purple text-lg">${amount.toFixed(2)}</p></div>
                </div>
            </div>

        </div>
    );
};

export default DriverActiveRide;
