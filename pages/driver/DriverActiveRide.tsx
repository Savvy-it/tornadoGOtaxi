
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { LocationPinIcon, PhoneIcon, MessageIcon, StarIcon, CheckCircleIcon, ExclamationIcon } from '../../components/icons';
import { useData } from '../../contexts/DataContext';
/*
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Custom SVG Icons for the map markers
const driverIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" fill="#8B5CF6" viewBox="0 0 24 24"><path d="M3.18,6.62C3.3,6.23,3.6,6,4,6h1.17c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75H4.7l-0.2,0.61 c-0.12,0.37-0.43,0.64-0.81,0.64c-0.47,0-0.85-0.38-0.85-0.85c0-0.3,0.16-0.56,0.39-0.71L3.18,6.62z M7.5,16 c-1.38,0-2.5-1.12-2.5-2.5S6.12,11,7.5,11s2.5,1.12,2.5,2.5S8.88,16,7.5,16z M16.5,16c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S17.88,16,16.5,16z M18.17,7.5H20c0.41,0,0.75-0.34,0.75-0.75S20.41,6,20,6h-1.17 c-0.41,0-0.75,0.34,0.75,0.75s0.34,0.75,0.75,0.75z M20.82,6.62l-0.05,0.18C20.94,6.94,21.1,7.2,21.1,7.5 c0,0.47-0.38,0.85-0.85,0.85c-0.38,0-0.69-0.26-0.81-0.64l-0.2-0.61h-0.47c-0.41,0-0.75-0.34-0.75-0.75S18.27,6,18.68,6 H19.8c0.4,0,0.7,0.23,0.82,0.62L20.82,6.62z M21.9,10.45c-0.33-1.43-1.24-2.7-2.43-3.61l-0.33-1.13C18.9,4.8,18.06,4,17.2,4H6.8 C5.94,4,5.1,4.8,4.86,5.71L4.53,6.83c-1.19,0.91-2.1,2.18-2.43,3.61C2.04,10.68,2,10.84,2,11v5c0,0.83,0.67,1.5,1.5,1.5 S5,16.83,5,16v-1h14v1c0,0.83,0.67,1.5,1.5,1.5S22,16.83,22,16v-5C22,10.84,21.96,10.68,21.9,10.45z"/></svg>'),
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

const locationIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" fill="#A78BFA" viewBox="0 0 24 24"><path d="M12,2C8.1,2,5,5.1,5,9c0,5.2,7,13,7,13s7-7.8,7-13C19,5.1,15.9,2,12,2z M12,11.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5 s2.5,1.1,2.5,2.5S13.4,11.5,12,11.5z"/></svg>'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Geocoding function using Nominatim
const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        if (!response.ok) {
            console.error("Geocoding API failed:", response.statusText);
            return null;
        }
        const data = await response.json();
        if (data && data.length > 0 && data[0].lat && data[0].lon) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            // Validate that the parsed coordinates are actual numbers
            if (!isNaN(lat) && !isNaN(lon)) {
                return [lat, lon];
            }
        }
        console.warn(`Geocoding failed for address: "${address}". Received invalid data.`);
        return null;
    } catch (error) {
        console.error(`Geocoding error for address "${address}":`, error);
        return null;
    }
};

interface Position { lat: number, lng: number }

const RoutingMachine: React.FC<{ waypoints: (Position | null)[] }> = ({ waypoints }) => {
    const map = useMap();
    const routingControlRef = useRef<any>(null);

    // Effect for creating and removing the control
    useEffect(() => {
        if (!map) return;

        // @ts-ignore
        const control = L.Routing.control({
            waypoints: [], // Start with empty waypoints
            routeWhileDragging: false,
            show: false, // Hide the turn-by-turn instructions panel
            addWaypoints: false,
            // FIX: The `lineOptions` object was missing required properties.
            // Based on leaflet-routing-machine type definitions, `extendToWaypoints` and `missingRouteTolerance`
            // are required. `addWaypoints` is also required. Added them to satisfy the type.
            lineOptions: {
                styles: [{ color: '#8B5CF6', opacity: 0.8, weight: 6 }],
                addWaypoints: false,
                extendToWaypoints: true,
                missingRouteTolerance: 1,
            },
            createMarker: () => null // We use our own React-Leaflet markers
        }).addTo(map);

        routingControlRef.current = control;

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [map]);

    // Effect for updating waypoints when they change
    useEffect(() => {
        if (!routingControlRef.current) return;

        const validWaypoints = waypoints.filter((wp): wp is Position => wp !== null);
        
        if (validWaypoints.length < 2) {
            routingControlRef.current.setWaypoints([]); // Clear route if not enough points
            return;
        }

        routingControlRef.current.setWaypoints(
            validWaypoints.map(wp => L.latLng(wp.lat, wp.lng))
        );

    }, [waypoints]);

    return null;
};


const MapComponent: React.FC<{ fromAddress: string; toAddress: string }> = ({ fromAddress, toAddress }) => {
    const [driverPos, setDriverPos] = useState<Position | null>(null);
    const [fromPos, setFromPos] = useState<Position | null>(null);
    const [toPos, setToPos] = useState<Position | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        // Fetch driver's location
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                if(isMounted) {
                    setDriverPos({ lat: position.coords.latitude, lng: position.coords.longitude });
                    if(error && error.startsWith("Could not get your location")) setError(null);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                if(isMounted) setError("Could not get your location. Please enable location services.");
            },
            { enableHighAccuracy: true }
        );

        // Geocode addresses
        const fetchCoordinates = async () => {
            const fromCoords = await geocodeAddress(fromAddress);
            if(isMounted) {
                if (fromCoords) setFromPos({ lat: fromCoords[0], lng: fromCoords[1] });
                else setError(prev => (prev ? prev + "\n" : "") + `Could not find location: ${fromAddress}`);
            }

            const toCoords = await geocodeAddress(toAddress);
            if(isMounted) {
                if (toCoords) setToPos({ lat: toCoords[0], lng: toCoords[1] });
                else setError(prev => (prev ? prev + "\n" : "") + `Could not find location: ${toAddress}`);
            }
        };

        fetchCoordinates();

        return () => {
            isMounted = false;
            navigator.geolocation.clearWatch(watchId);
        }
    }, [fromAddress, toAddress]);

    const center = driverPos || fromPos || { lat: 37.7749, lng: -122.4194 }; // Default to SF

    if (error) {
        return (
             <div className="h-full w-full bg-brand-dark rounded-lg flex items-center justify-center text-center text-red-400 p-4">
                 <div className="flex flex-col items-center">
                    <ExclamationIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>{error}</p>
                 </div>
            </div>
        )
    }
    
    if(!fromPos || !toPos){
        return (
            <div className="h-full w-full bg-brand-dark rounded-lg flex items-center justify-center text-center text-brand-text-secondary p-4">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Loading map...</p>
                 </div>
            </div>
        )
    }

    return (
        <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {driverPos && <Marker position={[driverPos.lat, driverPos.lng]} icon={driverIcon} />}
            {fromPos && <Marker position={[fromPos.lat, fromPos.lng]} icon={locationIcon} />}
            {toPos && <Marker position={[toPos.lat, toPos.lng]} icon={locationIcon} />}
            <RoutingMachine waypoints={[driverPos, fromPos, toPos]} />
        </MapContainer>
    );
};
*/

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
                <div className="aspect-video bg-brand-dark rounded-lg flex items-center justify-center p-4 text-center">
                    <div className="flex flex-col items-center">
                        <ExclamationIcon className="h-10 w-10 text-yellow-400 mb-2" />
                        <p className="font-semibold">Map Temporarily Disabled</p>
                        <p className="text-sm text-brand-text-secondary">The map feature is currently unavailable. Please use an external navigation app for directions.</p>
                    </div>
                    {/* <MapComponent fromAddress={from_address} toAddress={to_address} /> */}
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
