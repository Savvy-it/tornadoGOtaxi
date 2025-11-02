import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LightningIcon } from '../components/icons';

const AuthForm: React.FC<{ isRegister: boolean }> = ({ isRegister }) => {
  const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        if(password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register(fullName, email, phone, role, password);
        // On successful registration, the onAuthStateChange listener in AuthContext
        // will handle setting the user and the router will automatically redirect.
        // No success message is needed here for a seamless experience.
      } else {
        await login(email, password);
        // After login, the AuthContext state will update,
        // and the router in App.tsx will automatically redirect.
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const RoleButton: React.FC<{ value: UserRole }> = ({ value }) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      className={`w-full py-3 rounded-lg font-semibold transition ${
        role === value ? 'bg-brand-purple text-white' : 'bg-brand-dark-lighter text-brand-text-secondary'
      }`}
    >
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </button>
  );

  return (
    <form onSubmit={handleAuth} className="space-y-6">
      {error && (
        <p className="p-3 rounded-lg text-sm text-red-400 bg-red-500/10">{error}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-brand-text-secondary mb-2">
          {isRegister ? "I want to be a" : "I am a"}
        </label>
        <div className="flex gap-4">
          <RoleButton value={UserRole.PASSENGER} />
          <RoleButton value={UserRole.DRIVER} />
        </div>
      </div>

      {isRegister && <Input id="fullName" label="Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required disabled={loading} />}
      <Input id="email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
      {isRegister && <Input id="phone" label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required disabled={loading} />}
      
      <div className="relative">
        <Input id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
        {!isRegister && (
          <Link to="#" className="absolute right-0 -bottom-5 text-sm text-brand-purple-light hover:underline">
            Forgot password?
          </Link>
        )}
      </div>

      {isRegister && <Input id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={loading}/>}
      
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Processing...' : (isRegister ? "Create account" : "Sign in")}
      </Button>
    </form>
  );
};

const AuthPage: React.FC<{isRegister?: boolean}> = ({isRegister: isRegisterProp = false}) => {
  const location = useLocation();
  const isRegister = isRegisterProp || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Link to="/" className="flex justify-center mb-8">
            <LightningIcon className="h-10 w-10 text-brand-purple" />
        </Link>
        <div className="bg-brand-dark-light rounded-xl p-8">
          <div className="flex border-b border-brand-dark-lighter mb-6">
            <Link to="/login" className={`w-1/2 py-3 text-center font-semibold ${!isRegister ? 'text-white border-b-2 border-brand-purple' : 'text-brand-text-secondary'}`}>
              Sign In
            </Link>
            <Link to="/register" className={`w-1/2 py-3 text-center font-semibold ${isRegister ? 'text-white border-b-2 border-brand-purple' : 'text-brand-text-secondary'}`}>
              Register
            </Link>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {isRegister ? 'Create an account' : 'Sign in'}
            </h2>
            <p className="text-brand-text-secondary">
              {isRegister ? 'Enter your information to create an account' : 'Enter your email and password to access your account'}
            </p>
          </div>
          <AuthForm isRegister={isRegister} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;