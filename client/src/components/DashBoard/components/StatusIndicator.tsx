import React from 'react';
import { StatusIndicatorProps } from '../types';

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  icon, 
  value, 
  label 
}) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded">
      {icon}
      {(value || label) && (
        <div>
          {value && <div className="text-white">{value}</div>}
          {label && <div className="text-gray-400">{label}</div>}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;