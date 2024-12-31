import React from 'react';
import { Battery, Thermometer, Power, Gauge as GaugeIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Battery</h2>
          <div className="flex items-center">
            <Battery className="mr-2" />
            <span className="text-2xl font-bold">75%</span>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Temperature</h2>
          <div className="flex items-center">
            <Thermometer className="mr-2" />
            <span className="text-2xl font-bold">25°C</span>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Power</h2>
          <div className="flex items-center">
            <Power className="mr-2" />
            <span className="text-2xl font-bold">50%</span>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Gauge</h2>
          <div className="flex items-center">
            <GaugeIcon className="mr-2" />
            <span className="text-2xl font-bold">75%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;