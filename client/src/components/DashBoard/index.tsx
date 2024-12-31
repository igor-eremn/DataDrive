import React, { useState, useEffect } from 'react';
import { TopStatusIcons } from './components/TopStatusIcons';
import { Gauges } from './components/Gauges';
import { StatusIndicator } from './components/StatusIndicator';
import { MotorSpeedSetting } from './components/MotorSpeedSetting';
import { StatusBar } from './components/StatusBar';
import { fetchDashboardData, toggleChargingState } from './api/utils';

const Dashboard: React.FC = () => {
  const [isCharging, setIsCharging] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data[0]);
        setIsCharging(data[0].is_charging);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

    const socket = new WebSocket('ws://localhost:3000');

    socket.onmessage = (event) => {
      try {
        const updatedData = JSON.parse(event.data);
        console.log('ws message received:', updatedData);

        setDashboardData((prevData: any) => ({
          ...prevData,
          ...updatedData,
        }));
        if (updatedData.hasOwnProperty('is_charging')) {
          setIsCharging(updatedData.is_charging);
        }
      } catch (error) {
        console.error('Error parsing ws message:', error);
      }
    };

    socket.onerror = (error) => {
      //console.error('ws error:', error);
    };

    return () => {
      socket.close();
      console.log('ws connection closed');
    };
  }, []);

  const handleToggleCharging = async () => {
    try {
      const updatedData = await toggleChargingState();
      setIsCharging(updatedData.is_charging);
    } catch (error) {
      console.error('Error toggling charging state:', error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900">
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

      <StatusBar isCharging={isCharging} toggleCharging={handleToggleCharging} />
    </div>
  );
};

export default Dashboard;