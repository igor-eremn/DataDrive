import React, { useRef, useState, useEffect } from "react";

interface MotorSpeedSettingProps {
  speed: number; // Received speed from the parent component
  onSpeedChange: (speed: number) => void; // Function to update speed
}

export const MotorSpeedSetting: React.FC<MotorSpeedSettingProps> = ({
  speed,
  onSpeedChange,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(speed); // Local state for slider position

  // Update slider position whenever the `speed` prop changes
  useEffect(() => {
    setCurrentSpeed(speed);
  }, [speed]);

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!trackRef.current) return;

    const track = trackRef.current.getBoundingClientRect();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;

    const position = Math.min(
      Math.max(clientX - track.left, 0),
      track.width
    );

    const newSpeed = Math.round((position / track.width) * 4);

    if (newSpeed !== currentSpeed) {
      setCurrentSpeed(newSpeed);
      onSpeedChange(newSpeed); // Call the callback to update the parent
    }
  };

  const handleMouseDown = () => setDragging(true);

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (dragging) handleDrag(event);
  };

  return (
    <div
      className="px-6 py-6 select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <div className="text-white text-lg font-medium mb-4">
        MOTOR SPEED SETTING
      </div>
      <div className="flex flex-col items-center gap-4">
        <div
          ref={trackRef}
          className="relative w-full h-2 bg-gray-700 rounded-full"
        >
          {/* Background slider fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gray-500 rounded-full"
            style={{ width: `${(currentSpeed / 4) * 100}%` }} // Update slider fill based on `currentSpeed`
          />

          {/* Slider handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 lg:w-6 lg:h-6 rounded-full border-2 border-white bg-black cursor-pointer transition-all duration-200 ease-in-out"
            style={{
              left: `${(currentSpeed / 4) * 100}%`, // Update handle position based on `currentSpeed`
              transform: `translate(-50%, -50%)`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          />
        </div>

        {/* Speed labels */}
        <div className="flex justify-between w-full text-white text-sm">
          <span
            className={`w-10 text-center ${
              currentSpeed === 0 ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            OFF
          </span>
          {[1, 2, 3, 4].map((num) => (
            <span
              key={num}
              className={`w-10 text-center ${
                currentSpeed === num ? "text-white font-bold" : "text-gray-400"
              }`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotorSpeedSetting;