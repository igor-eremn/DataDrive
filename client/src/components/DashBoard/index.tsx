import React from 'react';
import { TopStatusIcons } from './components/TopStatusIcons';
import { Gauges } from './components/Gauges';
import { StatusIndicator } from './components/StatusIndicator';
import { MotorSpeedSetting } from './components/MotorSpeedSetting';
import { StatusBar } from './components/StatusBar';

const Dashboard: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      <div className="w-full border-b border-gray-800">
        <TopStatusIcons />
      </div>
      
      <Gauges />

      <div className="flex flex-col lg:flex-row gap-8 border-t-8 border-gray-800">
        <div className="flex-1 lg:w-1/2 border-b border-b-8 border-gray-800 lg:border-b-0">
          <StatusIndicator />
        </div>

        <div className="flex-1 lg:w-1/2">
          <MotorSpeedSetting />
        </div>
      </div>
      
      <StatusBar />
    </div>
  );
};

export default Dashboard;