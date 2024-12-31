import React from 'react';
import { Battery, Power } from 'lucide-react';

export const TopStatusIcons: React.FC = () => {
  return (
    <div className="flex justify-start gap-6 mb-8 p-2 border-b border-gray-800">
      <Power className="w-8 h-8 text-red-500" />
      {[...Array(3)].map((_, i) => (
        <Battery key={i} className="w-8 h-8 text-red-500" />
      ))}
    </div>
  );
};

export default TopStatusIcons;