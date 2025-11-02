import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Ride, RideStatus, User, UserRole, Message } from '../types';
import { useAuth, supabase } from './AuthContext';

interface DataContextType {
  rides: Ride[];
  pendingRequests: Ride[];
  acceptRide: (rideId: string) => Promise<void>;
  declineRide: (rideId: string) => void;
  requestRide: (from: string, to: string) => Promise<void>;
  getActiveRide: () => Ride | undefined;
  getMessages: (rideId: string) => Promise<Message[]>;
  sendMessage: (rideId: string, content: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Ride[]>([]);

  const fetchRides = useCallback(async (currentUser: User) => {
    if (!currentUser) return;

    let query = supabase.from('rides').select(`
      *,
      passenger:users!passenger_id(*),
      driver:users!driver_id(*)
    `);

    if (currentUser.role === UserRole.PASSENGER) {
      query = query.eq('passenger_id', currentUser.id);
    } else if (currentUser.role === UserRole.DRIVER) {
      // Driver sees their own rides + all pending rides
      query = query.or(`driver_id.eq.${currentUser.id},status.eq.Pending`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rides:', error);
      return;
    }
    
    // Distribute rides into categories
    const allRides: Ride[] = data || [];
    setRides(allRides);

    if (currentUser.role === UserRole.DRIVER) {
      setPendingRequests(allRides.filter(r => r.status === RideStatus.PENDING));
    }

  }, []);

  useEffect(() => {
    if (user) {
      fetchRides(user);
    }
  }, [user, fetchRides]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;
    const ridesSubscription = supabase.channel('public:rides')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, (payload) => {
        console.log('Change received!', payload);
        fetchRides(user);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ridesSubscription);
    };
  }, [user, fetchRides]);

  const acceptRide = async (rideId: string) => {
    if (!user || user.role !== 'driver') throw new Error("Only drivers can accept rides.");
    
    const { error } = await supabase
      .from('rides')
      .update({ status: RideStatus.ACTIVE, driver_id: user.id })
      .eq('id', rideId)
      .eq('status', RideStatus.PENDING); // Prevent race conditions

    if (error) {
      console.error("Error accepting ride:", error);
      throw error;
    }
    // Realtime will trigger a refetch
  };

  const declineRide = useCallback((rideId: string) => {
    // In a real app, you might mark this ride as 'declined_by_driver_x'
    // For this app, we'll just remove it from the local state for this driver.
    setPendingRequests(prev => prev.filter(r => r.id !== rideId));
  }, []);
  
  const requestRide = async (from: string, to: string) => {
      if (!user || user.role !== 'passenger') throw new Error("Only passengers can request rides.");
      
      // In a real app, duration, distance, and amount would be calculated by a backend service.
      const newRide = {
        passenger_id: user.id,
        from_address: from,
        to_address: to,
        duration: Math.floor(Math.random() * 20) + 10, // 10-30 mins
        distance: Math.round((Math.random() * 8 + 2) * 10) / 10, // 2-10 miles
        amount: Math.round((Math.random() * 15 + 10) * 100) / 100, // $10-$25
        status: RideStatus.PENDING,
      };
      
      const { error } = await supabase.from('rides').insert(newRide);
      if (error) {
          console.error("Error requesting ride:", error);
          throw error;
      }
      alert("Ride requested! A driver will be matched shortly.");
      // Realtime will trigger a refetch
  };

  const getActiveRide = useCallback((): Ride | undefined => {
    if(!user) return undefined;
    if (user.role === 'driver') {
      return rides.find(r => r.status === RideStatus.ACTIVE && r.driver_id === user.id);
    }
    if (user.role === 'passenger') {
      return rides.find(r => r.status === RideStatus.ACTIVE && r.passenger_id === user.id);
    }
  }, [rides, user]);
  
  const getMessages = async (rideId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('ride_id', rideId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data as Message[];
  };

  const sendMessage = async (rideId: string, content: string) => {
    if (!user) return;
    const { error } = await supabase.from('messages').insert({
      ride_id: rideId,
      sender_id: user.id,
      content,
    });
    if (error) console.error('Error sending message:', error);
  };


  return (
    <DataContext.Provider value={{ rides, pendingRequests, acceptRide, declineRide, requestRide, getActiveRide, getMessages, sendMessage }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
