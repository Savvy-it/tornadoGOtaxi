
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardIcon, ClockIcon, CheckCircleIcon, LightningIcon } from '../components/icons';

const DriverLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navItems = [
    { path: '/driver/dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { path: '/driver/pending', icon: ClockIcon, label: 'Pending' },
    { path: '/driver/active', icon: LightningIcon, label: 'Active' },
    { path: '/driver/completed', icon: CheckCircleIcon, label: 'Completed' },
  ];

  const NavItem: React.FC<{ path: string, icon: React.FC<{className?:string}>, label: string }> = ({ path, icon: Icon, label }) => (
    <NavLink 
      to={path}
      className={({ isActive }) => 
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-brand-purple text-white' : 'text-brand-text-secondary hover:bg-brand-dark-lighter hover:text-white'}`
      }
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-semibold">{label}</span>
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
      <nav className="p-2 flex overflow-x-auto space-x-2 bg-brand-dark border-b border-brand-dark-lighter">
        {navItems.map(item => <NavItem key={item.path} {...item} />)}
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;
