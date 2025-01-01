export const fetchDashboardData = async (): Promise<any[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const toggleChargingState = async (): Promise<any> => {
  try {
    const response = await fetch('http://localhost:3000/api/toggle-charging/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle charging state: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling charging state:', error);
    throw error;
  }
};

export const updateMotorSpeed = async (speed: number): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:3000/api/update-speed/1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ speed }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update motor speed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating motor speed:', error);
    throw error;
  }
};