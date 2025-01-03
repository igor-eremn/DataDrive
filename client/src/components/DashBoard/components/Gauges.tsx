import React, { useState, useEffect } from 'react';
import GaugeComponent from 'react-gauge-component';

interface GaugesProps {
  motorRpm: number;
  powerConsumption: number;
}

export const Gauges: React.FC<GaugesProps> = ({ motorRpm, powerConsumption }) => {
  const [checkKW, setCheckKW] = useState(false);

  useEffect(() => {
    if (powerConsumption === 0) {
      setCheckKW(false);
    } else {
      setCheckKW(true);
    }
  }, [powerConsumption]);

  return (
    <div className="flex-1 flex justify-center items-center gap-[5%] px-4">
      {/* Power Consumption Gauge */}
      <div className="relative w-[45%] max-w-[400px] min-w-[150px]">
        <GaugeComponent
          value={powerConsumption}
          type="radial"
          labels={{
            valueLabel: {
              style: { fontSize: 20 },
              formatTextValue: (val: number) => `${Math.round(val)} kW`,
            },
            tickLabels: {
              type: 'inner',
              ticks: [
                { value: -1000 },
                { value: -750 },
                { value: -500 },
                { value: -250 },
                { value: 0 },
                { value: 250 },
                { value: 500 },
                { value: 750 },
                { value: 1000 },
              ],
            },
          }}
          arc={{
            subArcs: [
              { limit: -333.33, color: '#5BE12C' }, // Green zone
              { limit: 333.33, color: '#F5CD19' },  // Yellow zone
              { limit: 1000, color: '#EA4228' },    // Red zone
            ],
            padding: 0.02,
            width: 0.02,
          }}
          pointer={{
            elastic: false,
            animationDelay: 1.5,
            animate: checkKW,
          }}
          minValue={-1000}
          maxValue={1000}
        />
      </div>

      {/* Motor RPM Gauge */}
      <div className="relative w-[45%] max-w-[400px] min-w-[150px]">
        <GaugeComponent
          value={motorRpm}
          type="radial"
          labels={{
            valueLabel: {
              style: { fontSize: 20 },
              formatTextValue: (val: number) => `${Math.round(val)} RPM`,
            },
            tickLabels: {
              type: 'inner',
              ticks: [
                { value: 100 },
                { value: 200 },
                { value: 300 },
                { value: 400 },
                { value: 500 },
                { value: 600 },
                { value: 700 },
                { value: 800 },
              ],
            },
          }}
          arc={{
            subArcs: [
              { limit: 250, color: '#5BE12C' },   // Green zone
              { limit: 450, color: '#F5CD19' },   // Yellow zone
              { limit: 650, color: '#EA4228' },   // Orange zone
              { limit: 900, color: '#8B0000' },   // Dark Red zone
            ],
            padding: 0.02,
            width: 0.02,
          }}
          pointer={{
            elastic: true,
            animationDelay: 0,
          }}
          minValue={0}
          maxValue={900}
        />
      </div>
    </div>
  );
};

export default Gauges;