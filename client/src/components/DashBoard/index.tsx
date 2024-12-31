import React from 'react';
import { Battery, Thermometer, Power, Gauge as GaugeIcon } from 'lucide-react';
import { TopStatusIcons } from './components/TopStatusIcons';
import { Gauge } from './components/Gauge';

const Dashboard: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg">
      <TopStatusIcons />
      
      <div className="flex flex-wrap justify-around gap-8 mb-8">
        <Gauge value={0} unit="kW" max={1000} />
        <Gauge value={0} unit="RPM" max={800} />
      </div>
    </div>
  );
};

export default Dashboard;