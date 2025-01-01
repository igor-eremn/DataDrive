import React from 'react';
import { BatteryWarning, ShieldAlert, TriangleAlert, CircleParking } from 'lucide-react';

interface TopStatusIconsProps {
  statuses: {
    parkingBrake: boolean;
    checkEngine: boolean;
    motorActive: boolean;
    lowBattery: boolean;
  };
}

export const TopStatusIcons: React.FC<TopStatusIconsProps> = ({ statuses }) => {
  const icons = [
    { icon: <CircleParking />, active: statuses.parkingBrake },
    { icon: <TriangleAlert />, active: statuses.checkEngine },
    { icon: <ShieldAlert />, active: statuses.motorActive },
    { icon: <BatteryWarning />, active: statuses.lowBattery },
  ];

  return (
    <div className="flex gap-px bg-gray-800 w-fit">
      {icons.map((item, index) => (
        <div 
          key={index}
          className="w-16 h-16 bg-gray-900 flex items-center justify-center"
        >
          {React.cloneElement(item.icon, { 
            className: `w-8 h-8 ${item.active ? 'text-red-500' : 'text-gray-800'}`,
          })}
        </div>
      ))}
    </div>
  );
};

export default TopStatusIcons;