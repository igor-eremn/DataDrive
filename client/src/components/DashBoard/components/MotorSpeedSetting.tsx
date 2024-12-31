import React from 'react';
import { MotorSpeedSettingProps } from '../types';

export const MotorSpeedSetting: React.FC<MotorSpeedSettingProps> = () => {
  return (
    <div className="px-6 py-10">
      <div className="text-white mb-2">MOTOR SPEED SETTING</div>
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full border-2 border-white" />
        <div className="flex-1 h-1 bg-gray-700 rounded">
          <div className="h-full w-0 bg-white rounded" />
        </div>
        <div className="flex gap-3 text-gray-400 text-sm">
          <span>OFF</span>
          {[1, 2, 3, 4].map(num => (
            <span key={num}>{num}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotorSpeedSetting;