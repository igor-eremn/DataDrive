import React from 'react';
import { Battery, Thermometer, Power, Gauge as GaugeIcon } from 'lucide-react';
import { TopStatusIcons } from './components/TopStatusIcons';
import { Gauge } from './components/Gauge';
import { StatusIndicator } from './components/StatusIndicator';
import { MotorSpeedSetting } from './components/MotorSpeedSetting';

const Dashboard: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg">
      <TopStatusIcons />
      
      <div className="flex flex-wrap justify-around gap-8 mb-8">
        <Gauge value={0} unit="kW" max={1000} />
        <Gauge value={0} unit="RPM" max={800} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatusIndicator 
          icon={<GaugeIcon className="w-6 h-6 text-gray-400" />}
          label="N/N"
        />
        <StatusIndicator 
          icon={<Battery className="w-6 h-6 text-gray-400" />}
          value="22"
          label="%"
        />
        <StatusIndicator 
          icon={<Thermometer className="w-6 h-6 text-gray-400" />}
          value="33"
          label="°C"
        />
        <StatusIndicator 
          icon={<Power className="w-6 h-6 text-gray-400" />}
          value="0.0"
          label="RPM"
        />
      </div>

      <MotorSpeedSetting currentSpeed={0} maxSpeed={4} />
    </div>
  );
};

export default Dashboard;