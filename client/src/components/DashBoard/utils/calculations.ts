export const chargingUpdate = async (endpoint: string, payload: Record<string, any>) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with a status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending update to server:', error);
      throw error;
    }
  };