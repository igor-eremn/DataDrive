import React from 'react';
import { GaugeIcon, Battery, Thermometer, Power } from 'lucide-react';

interface StatusIndicatorProps {
  data: {
    gearRatio: string;
    batteryPercentage: string;
    batteryTemperature: string;
    motorRpm: number;
  };
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ data }) => {
  const items = [
    { icon: <GaugeIcon />, value: data.gearRatio },
    { icon: <Battery />, value: `${data.batteryPercentage}%` },
    { icon: <Thermometer />, value: `${data.batteryTemperature}ºC` },
    { icon: <Power />, value: `${data.motorRpm} RPM`},
  ];

  return (
    <div className="grid grid-cols-4 lg:grid-cols-4 gap-px bg-gray-800 flex-1">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 px-6 py-14 bg-gray-900">
          {React.cloneElement(item.icon, {
            className: "w-6 h-6 text-gray-400",
          })}
          <div>
            {item.value && <div className="text-white">{item.value}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusIndicator;