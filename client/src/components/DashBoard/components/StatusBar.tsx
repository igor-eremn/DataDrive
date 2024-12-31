import React from 'react';
import { Power } from 'lucide-react';
import { Battery, Thermometer, Gauge } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
        <div className="flex gap-4">
            <Gauge className="w-6 h-6 text-gray-400" />
            <Battery className="w-6 h-6 text-gray-400" />
            <Thermometer className="w-6 h-6 text-gray-400" />
        </div>
        <div className="grid grid-cols-3 gap-1 p-2 bg-gray-800 rounded">
            {[...Array(9)].map((_, i) => (
            <div 
                key={i}
                className={`w-4 h-4 ${i === 0 ? 'bg-white' : 'bg-gray-600'}`}
            />
            ))}
        </div>
        <div>
            <Power className="w-6 h-6 text-gray-400" />
        </div>
    </div>
  );
};

export default StatusBar;