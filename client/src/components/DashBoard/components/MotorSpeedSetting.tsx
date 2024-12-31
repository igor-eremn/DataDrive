import React from 'react';
import { MotorSpeedSettingProps } from '../types';

export const MotorSpeedSetting: React.FC<MotorSpeedSettingProps> = ({
  currentSpeed,
  maxSpeed
}) => {
  return (
    <div className="mb-8">
      <div className="text-white mb-2">MOTOR SPEED SETTING</div>
      <div className="flex items-center gap-4">
        <div className="w-4 h-4 rounded-full border-2 border-white" />
        <div className="flex-1 h-2 bg-gray-700 rounded">
          <div 
            className="h-full bg-white rounded"
            style={{ width: `${(currentSpeed / maxSpeed) * 100}%` }}
          />
        </div>
        <div className="flex gap-4 text-gray-400">
          <span>OFF</span>
          {[...Array(maxSpeed)].map((_, i) => (
            <span key={i + 1}>{i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotorSpeedSetting;