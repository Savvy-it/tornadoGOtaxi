export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
}

export interface User {
  id: string; // This is the UUID from auth.users
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  rating?: number;
  avatar_url?: string;
}

export enum RideStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  ACTIVE = 'Active',
  CANCELED = 'Canceled',
}

export interface Ride {
  id: string;
  passenger_id: string;
  driver_id?: string;
  from_address: string;
  to_address: string;
  created_at: string; // ISO 8601 timestamp
  scheduled_for?: string; // ISO 8601 timestamp, for scheduled rides
  duration: number; // in minutes
  distance: number; // in miles
  amount: number; // in USD
  status: RideStatus;
  // For UI display, we'll fetch these separately and join them.
  passenger?: User; 
  driver?: User;
}

export interface Message {
    id: string;
    ride_id: string;
    sender_id: string;
    content: string;
    created_at: string; // ISO 8601 timestamp
}
