import React from 'react';
import { Battery, Power } from 'lucide-react';

export const TopStatusIcons: React.FC = () => {
  return (
    <div className="flex gap-px bg-gray-800 w-fit">
      {[<Power />, <Battery />, <Battery />, <Battery />, <div></div>].map((icon, index) => (
        <div 
          key={index}
          className="w-16 h-16 bg-gray-900 flex items-center justify-center"
        >
          {React.cloneElement(icon, { 
            className: "w-8 h-8 text-red-500"
          })}
        </div>
      ))}
    </div>
  );
};

export default TopStatusIcons;