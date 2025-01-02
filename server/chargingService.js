const db = require('./db');
const chargingJobs = {};

async function startCharging(id, broadcast) {
  if (chargingJobs[id]) {
    clearInterval(chargingJobs[id]);
  }

  // Initialize Charging Interval to Update Battery and Power Consumption
  const intervalId = setInterval(async () => {
    try {
      // Fetch Current State from Database
      const selectQuery = `
        SELECT battery_percentage, is_charging, power_consumption
        FROM dashboard
        WHERE id = $1
      `;
      const { rows } = await db.query(selectQuery, [id]);
      if (rows.length === 0) {
        clearInterval(intervalId);
        delete chargingJobs[id];
        return;
      }

      let { battery_percentage, is_charging, power_consumption } = rows[0];
      battery_percentage = parseFloat(battery_percentage);
      power_consumption = parseFloat(power_consumption);

      // Determine If Charging Should Stop
      if (!is_charging || battery_percentage >= 100) {
        clearInterval(intervalId);
        delete chargingJobs[id];

        if (battery_percentage >= 100) {
          // Handle Battery Fully Charged
          await db.query(
            'UPDATE dashboard SET battery_percentage = 100.0, is_charging = false, power_consumption = 0.00 WHERE id = $1',
            [id]
          );
          const { rows: updatedRows } = await db.query('SELECT * FROM dashboard WHERE id = $1', [id]);
          broadcast(updatedRows[0]);
        } else {
          // Reset Power Consumption When Charging Stops
          await db.query('UPDATE dashboard SET power_consumption = 0.00 WHERE id = $1', [id]);
          const { rows: updatedRows } = await db.query('SELECT * FROM dashboard WHERE id = $1', [id]);
          broadcast(updatedRows[0]);
        }
        return;
      }

      // Update Battery Percentage and Power Consumption
      const newBattery = battery_percentage + 0.9;
      let newPowerConsumption = power_consumption;

      if (newPowerConsumption === 0) {
        newPowerConsumption = -1;
      }
      else if (newPowerConsumption > -900) {
        newPowerConsumption -= 900;
        if (newPowerConsumption < -900) {
          newPowerConsumption = -900;
        }
      }
      else {
        const minRand = -950;
        const maxRand = -850;
        newPowerConsumption = Math.floor(
          Math.random() * (maxRand - minRand + 1) + minRand
        );
      }

      // Cap Power Consumption Values
      if (newPowerConsumption < -999.99) {
        newPowerConsumption = -999.99;
      } else if (newPowerConsumption > 999.99) {
        newPowerConsumption = 999.99;
      }

      // Update Database
      const updateQuery = `
        UPDATE dashboard
        SET battery_percentage = $1,
            power_consumption = $2
        WHERE id = $3
        RETURNING *
      `;
      const { rows: updated } = await db.query(updateQuery, [newBattery, newPowerConsumption, id]);

      console.log('🔌 Power Consumption:', newPowerConsumption);
      broadcast(updated[0]);

    } catch (err) {
      console.error('Error in charging interval:', err);
      clearInterval(intervalId);
      delete chargingJobs[id];
    }
  }, 1000); // Interval for Charging Process

  chargingJobs[id] = intervalId;
}

function stopCharging(id, broadcast) {
  if (chargingJobs[id]) {
    clearInterval(chargingJobs[id]);
    delete chargingJobs[id];
  }

  // Reset Power Consumption
  (async () => {
    try {
      const resetConsumptionQuery = `
        UPDATE dashboard
        SET power_consumption = 0.00
        WHERE id = $1
        RETURNING *
      `;
      const { rows } = await db.query(resetConsumptionQuery, [id]);
      if (rows.length > 0) {
        console.log('🔌 Power Consumption Reset to 0 after stopping charging.');
        if (broadcast) {
          broadcast(rows[0]);
        }
      }
    } catch (err) {
      console.error('Error resetting power consumption after stopping charging:', err);
    }
  })();
}

module.exports = {
  startCharging,
  stopCharging,
  chargingJobs,
};