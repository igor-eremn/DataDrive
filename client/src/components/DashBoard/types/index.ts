export interface GaugeProps {
    value: number;
    unit: string;
    max: number;
}  
  
export interface StatusIndicatorProps {
    icon: React.ReactNode;
    value?: string | number;
    label?: string;
}
  
export interface MotorSpeedSettingProps {
    currentSpeed: number;
    maxSpeed: number;
}