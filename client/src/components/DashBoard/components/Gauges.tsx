import React from 'react';

export const Gauges: React.FC = () => {
  return (
    <div className="flex-1 flex justify-center items-center gap-[5%] px-4">
      <div className="relative w-[45%] max-w-[400px] min-w-[150px]">
        <div className="aspect-square relative">
          <div className="absolute inset-0 rounded-full border-2 border-gray-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[min(5vw,4rem)] font-bold text-white">0</span>
            <span className="text-[min(2vw,1.25rem)] text-gray-400">kW</span>
          </div>
          <div className="absolute top-0 left-1/2 h-1/2 w-1 bg-white origin-bottom transform -translate-x-1/2" />
        </div>
      </div>

      <div className="relative w-[45%] max-w-[400px] min-w-[150px]">
        <div className="aspect-square relative">
          <div className="absolute inset-0 rounded-full border-2 border-gray-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[min(5vw,4rem)] font-bold text-white">0</span>
            <span className="text-[min(2vw,1.25rem)] text-gray-400">RPM</span>
          </div>
          <div className="absolute top-0 left-1/2 h-1/2 w-1 bg-white origin-bottom transform -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Gauges;