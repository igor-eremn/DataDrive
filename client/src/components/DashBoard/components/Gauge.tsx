import React from 'react';
import { GaugeProps } from '../types';

export const Gauge: React.FC<GaugeProps> = ({ value, unit, max }) => {
  const rotation = (value / max) * 180; // Convert value to degrees

  return (
    <div className="relative w-48 h-48">
      <div className="absolute inset-0 rounded-full border-4 border-gray-700" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-gray-400">{unit}</span>
      </div>
      <div 
        className="absolute top-0 left-1/2 h-1/2 w-1 bg-white origin-bottom transform -translate-x-1/2"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      />
    </div>
  );
};

export default Gauge;