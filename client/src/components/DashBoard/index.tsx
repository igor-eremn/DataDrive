import React, { useState, useEffect } from 'react';
import { TopStatusIcons } from './components/TopStatusIcons';
import { Gauges } from './components/Gauges';
import { StatusIndicator } from './components/StatusIndicator';
import { MotorSpeedSetting } from './components/MotorSpeedSetting';
import { StatusBar } from './components/StatusBar';
import { fetchDashboardData, toggleChargingState, updateMotorSpeed, fetchStatuses } from './api/utils';

const Dashboard: React.FC = () => {
  const [isCharging, setIsCharging] = useState(false);
  const [hasPower, setHasPower] = useState(false);
  const [motorSpeed, setMotorSpeed] = useState(0);
  const [motorRpm, setMotorRpm] = useState(0);
  const [powerConsumption, setPowerConsumption] = useState(0);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [statuses, setStatuses] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData();
        const row = data[0];

        setDashboardData(row);
        setIsCharging(row.is_charging);
        setHasPower(row.battery_percentage > 0);
        console.log('row battery:', row.battery_percentage);
        setMotorSpeed(row.motor_speed);
        setMotorRpm(parseInt(row.motor_rpm, 10));
        setPowerConsumption(parseInt(row.power_consumption, 10));

        const statusData = await fetchStatuses();
        setStatuses(statusData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

    const socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = async (event) => {
      try {
        const updatedData = JSON.parse(event.data);
        console.log('ws message received:', updatedData);

        setDashboardData((prevData: any) => ({
          ...prevData,
          ...updatedData,
        }));

        if (updatedData.hasOwnProperty('is_charging')) {
          setIsCharging(updatedData.is_charging);
          setHasPower(updatedData.battery_percentage > 0);
        }

        if (updatedData.hasOwnProperty('motor_speed')) {
          setMotorSpeed(updatedData.motor_speed);
        }

        if (updatedData.hasOwnProperty('motor_rpm')) {
          setMotorRpm(parseInt(updatedData.motor_rpm, 10));
        }

        if (updatedData.hasOwnProperty('power_consumption')) {
          setPowerConsumption(parseInt(updatedData.power_consumption, 10));
        }

        const statusData = await fetchStatuses();
        setStatuses(statusData);
      } catch (error) {
        console.error('Error parsing ws message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('ws error:', error);
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

  const handleSpeedChange = async (speed: number) => {
    try {
      const updatedData = await updateMotorSpeed(speed);
      setMotorSpeed(updatedData.motor_speed);
      setMotorRpm(updatedData.motor_rpm);
    } catch (error) {
      console.error('Error updating motor speed:', error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900">
      <div className="w-full border-b border-gray-800">
        {statuses && <TopStatusIcons statuses={statuses} />}
      </div>

      <Gauges motorRpm={motorRpm} powerConsumption={powerConsumption} />

      <div className="flex flex-col lg:flex-row gap-8 border-t-8 border-gray-800">
        <div className="flex-1 lg:w-1/2 border-b border-b-8 border-gray-800 lg:border-b-0">
          {dashboardData && (
            <StatusIndicator
              data={{
                gearRatio: dashboardData.gear_ratio,
                batteryPercentage: dashboardData.battery_percentage,
                batteryTemperature: dashboardData.battery_temperature,
                motorRpm: dashboardData.motor_rpm,
                is_charging: isCharging,
              }}
            />
          )}
        </div>

        <div className="flex-1 lg:w-1/2">
          {dashboardData && (
            <MotorSpeedSetting
              speed={motorSpeed}
              onSpeedChange={handleSpeedChange}
              disabledCharging={isCharging}
              disabledPower={!hasPower}
            />
          )}
        </div>
      </div>

      <StatusBar isCharging={isCharging} toggleCharging={handleToggleCharging} />
    </div>
  );
};

export default Dashboard;