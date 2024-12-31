import React from 'react';
import { Power } from 'lucide-react';
import { Battery, Thermometer, Gauge } from 'lucide-react';

export const StatusBar: React.FC = () => {
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
          <Power className="text-gray-400 w-6 h-6 lg:w-8 lg:h-8 transition-all duration-300 ease-in-out" />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;