import React from 'react';
import { Battery, Thermometer, Gauge, PlugZap, Power } from 'lucide-react';

interface StatusBarProps {
  isCharging: boolean;
  toggleCharging: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isCharging, toggleCharging }) => {
  return (
    <div className="w-full border-t-8 border-gray-800">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex gap-4">
          <Gauge className="text-gray-400 w-6 h-6 lg:w-8 lg:h-8 transition-all duration-300 ease-in-out" />
          <Battery className="text-gray-400 w-6 h-6 lg:w-8 lg:h-8 transition-all duration-300 ease-in-out" />
          <Thermometer className="text-gray-400 w-6 h-6 lg:w-8 lg:h-8 transition-all duration-300 ease-in-out" />
        </div>

        <div className="grid grid-cols-3 gap-1 p-2 bg-gray-800 rounded">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 ${i === 0 ? 'bg-white' : 'bg-gray-600'} lg:w-6 lg:h-6 transition-all duration-300 ease-in-out`}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <Power className="text-gray-900 w-6 h-6 lg:w-8 lg:h-8 transition-all duration-300 ease-in-out" />
          <Power className="text-gray-900 w-6 h-6 lg:w-8 lg:h-8 transition-all duration-300 ease-in-out" />

          {/* PlugZap with hover and charging effects */}
          <div
            className={`relative w-8 h-8 lg:w-10 lg:h-10 cursor-pointer transition-transform duration-300 ease-in-out ${
              isCharging ? 'scale-110' : 'hover:scale-110'
            }`}
            onClick={toggleCharging} // Call the toggle function from Dashboard
          >
            {isCharging && (
              <div className="absolute inset-0 rounded-full animate-pulse bg-green-500 opacity-20 blur-xl" />
            )}
            <PlugZap
              className={`relative z-10 w-full h-full ${
                isCharging ? 'text-green-500' : 'text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;