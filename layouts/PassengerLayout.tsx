import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, BookIcon, HistoryIcon, LightningIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { Message, Ride } from '../types';
import Button from '../components/common/Button';
import { supabase } from '../contexts/AuthContext';
import { format } from 'date-fns';

const PassengerLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/passenger/home', icon: HomeIcon, label: 'Home' },
    { path: '/passenger/book', icon: BookIcon, label: 'Book' },
    { path: '/passenger/my-rides', icon: HistoryIcon, label: 'History' },
  ];

  const NavItem: React.FC<{ path: string, icon: React.FC<{className?:string}>, label: string }> = ({ path, icon: Icon, label }) => (
    <NavLink 
      to={path}
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-purple' : 'text-brand-text-secondary hover:text-white'}`
      }
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <header className="px-4 py-3 sm:px-6 bg-brand-dark-light sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LightningIcon className="h-7 w-7 text-brand-purple" />
            <span className="text-xl font-bold">Tornado Taxi</span>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-red-400 hover:text-red-300 transition">
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-grow pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-dark-light border-t border-brand-dark-lighter p-3 flex justify-around items-center">
        {navItems.map(item => <NavItem key={item.path} {...item} />)}
      </nav>
    </div>
  );
};

export default PassengerLayout;


// Chat Page Component
export const ChatPage: React.FC = () => {
    const { rideId } = useParams<{ rideId: string }>();
    const { user } = useAuth();
    const { getMessages, sendMessage } = useData();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [ride, setRide] = useState<Ride | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!rideId) return;

        const fetchRideDetails = async () => {
            const { data, error } = await supabase.from('rides').select('*, passenger:users!passenger_id(*), driver:users!driver_id(*)').eq('id', rideId).single();
            if (error) console.error("Error fetching ride details", error);
            else setRide(data as Ride);
        }

        const fetchMessages = async () => {
            const initialMessages = await getMessages(rideId);
            setMessages(initialMessages);
        };

        fetchRideDetails();
        fetchMessages();

        const channel = supabase.channel(`chat:${rideId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `ride_id=eq.${rideId}` },
                (payload) => {
                    setMessages(currentMessages => [...currentMessages, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [rideId, getMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !rideId) return;
        await sendMessage(rideId, newMessage);
        setNewMessage('');
    };

    if (!user || !ride) return <div className="p-4 flex justify-center items-center h-full">Loading chat...</div>;

    const otherUser = user.id === ride.passenger_id ? ride.driver : ride.passenger;

    return (
        <div className="h-full flex flex-col">
             <header className="px-4 py-3 sm:px-6 bg-brand-dark-light sticky top-0 z-10 flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-brand-dark-lighter">&larr;</button>
                <h1 className="text-xl font-bold">Chat with {otherUser?.full_name || '...'}</h1>
            </header>
            <div className="flex-grow overflow-y-auto p-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender_id === user.id ? 'bg-brand-purple text-white' : 'bg-brand-dark-lighter'}`}>
                            <p>{msg.content}</p>
                            <p className="text-xs opacity-60 mt-1 text-right">{format(new Date(msg.created_at), 'p')}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex gap-2 p-4 bg-brand-dark-light">
                <input
                    id="message"
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-brand-dark border border-brand-dark-lighter rounded-lg px-4 py-3 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    autoComplete="off"
                />
                <Button type="submit" variant="primary" className="!w-auto">Send</Button>
            </form>
        </div>
    );
};
