import React from 'react';
import { StatusIndicatorProps } from '../types';
import { GaugeIcon, Battery, Thermometer, Power } from 'lucide-react';

export const StatusIndicator: React.FC<StatusIndicatorProps> = () => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-4 gap-px bg-gray-800 flex-1">
      {[
        { icon: <GaugeIcon />, label: "N/N" },
        { icon: <Battery />, value: "22", label: "%" },
        { icon: <Thermometer />, value: "33", label: "°C" },
        { icon: <Power />, value: "0.0", label: "RPM" }
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-2 px-6 py-10 bg-gray-900">
          {React.cloneElement(item.icon, { 
            className: "w-6 h-6 text-gray-400"
          })}
            <div>
              {item.value && <div className="text-white">{item.value}</div>}
              <div className="text-gray-400">{item.label}</div>
            </div>
          </div>
      ))}
    </div>
  );
};

export default StatusIndicator;