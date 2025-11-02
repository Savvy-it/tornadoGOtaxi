
import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { ExclamationIcon } from '../../components/icons';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
      checked ? 'bg-brand-purple' : 'bg-brand-dark-lighter'
    }`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const DaySchedule: React.FC<{ day: string; time: string; defaultOn?: boolean }> = ({ day, time, defaultOn = true }) => {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <div className="flex justify-between items-center bg-brand-dark p-4 rounded-lg">
      <div>
        <p className="font-semibold">{day}</p>
        <p className="text-sm text-brand-text-secondary">{isOn ? time : 'Off'}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-sm font-semibold ${isOn ? 'text-green-400' : 'text-brand-text-secondary'}`}>
          {isOn ? 'Working' : 'Off'}
        </span>
        <ToggleSwitch checked={isOn} onChange={setIsOn} />
      </div>
    </div>
  );
};

const DriverAvailability: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Availability Settings</h1>
      <p className="text-brand-text-secondary">Manage your work schedule and break times</p>
      
      {/* Current Status */}
      <div className="bg-brand-dark-light p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Current Status</h2>
            <p className="text-brand-text-secondary text-sm">Your availability to passengers</p>
          </div>
          <ToggleSwitch checked={isOnline} onChange={setIsOnline} />
        </div>
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${isOnline ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
            You are currently {isOnline ? 'online and accepting ride requests' : 'offline and not accepting rides'}.
        </div>
      </div>
      
      {/* Weekly Schedule */}
      <div className="bg-brand-dark-light p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Weekly Working Hours</h2>
        <p className="text-brand-text-secondary text-sm mb-4">Set your availability for each day of the week.</p>
        <div className="space-y-3">
          <DaySchedule day="Monday" time="09:00 AM - 05:00 PM" />
          <DaySchedule day="Tuesday" time="09:00 AM - 05:00 PM" />
          <DaySchedule day="Wednesday" time="09:00 AM - 05:00 PM" />
          <DaySchedule day="Thursday" time="09:00 AM - 05:00 PM" />
          <DaySchedule day="Friday" time="09:00 AM - 05:00 PM" />
          <DaySchedule day="Saturday" time="10:00 AM - 08:00 PM" />
          <DaySchedule day="Sunday" time="Not working" defaultOn={false} />
        </div>
      </div>

      <div className="bg-blue-500/10 text-blue-300 p-4 rounded-xl flex items-start gap-3">
        <ExclamationIcon className="h-6 w-6 flex-shrink-0 mt-0.5" />
        <p className="text-sm">You are available to drive 6 days per week. Passengers can only request rides during your working hours.</p>
      </div>

      <Button variant="primary">Save Schedule</Button>
    </div>
  );
};

export default DriverAvailability;
