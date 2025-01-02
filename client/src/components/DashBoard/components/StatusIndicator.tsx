import React, { useState, useEffect } from 'react';
import { GaugeIcon, Battery, Thermometer, Power } from 'lucide-react';
import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

interface StatusIndicatorProps {
  data: {
    gearRatio: string;
    batteryPercentage: string;
    batteryTemperature: string;
    motorRpm: number;
    is_charging: boolean;
  };
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ data }) => {
  const [chargingIcon, setChargingIcon] = useState<JSX.Element>(<BatteryLow />);

  useEffect(() => {
    // If the device is charging, cycle through different battery icons
    if (data.is_charging) {
      let currentIndex = 0;
      const icons = [<BatteryLow key="low" />, <BatteryMedium key="medium" />, <BatteryFull key="full" />];
      
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % icons.length;
        setChargingIcon(icons[currentIndex]);
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [data.is_charging]);

  // Array of status items to display in the grid
  const items = [
    { icon: <GaugeIcon />, value: data.gearRatio },
    {
      icon: data.is_charging ? chargingIcon : <Battery />,
      value: `${parseInt(data.batteryPercentage, 10)}%`,
    },
    { icon: <Thermometer />, value: `${parseInt(data.batteryTemperature, 10)}ºC` },
    { icon: <Power />, value: `${data.motorRpm} RPM` },
  ];

  return (
    // Grid container for status indicators
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