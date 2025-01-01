const db = require('./db');

const temperatureJobs = {};

const SPEED_TEMP_MAP = {
  0: 25,
  1: 30,
  2: 36,
  3: 42,
  4: 50,
};

async function startTemperatureService(id, broadcast) {
  if (temperatureJobs[id]) {
    clearInterval(temperatureJobs[id]);
  }

  const intervalId = setInterval(async () => {
    try {
      const selectQuery = `
        SELECT motor_speed, battery_temperature, battery_percentage, is_charging
        FROM dashboard
        WHERE id = $1
      `;
      const { rows } = await db.query(selectQuery, [id]);
      if (rows.length === 0) {
        clearInterval(intervalId);
        delete temperatureJobs[id];
        return;
      }

      let {
        motor_speed,
        battery_temperature,
        battery_percentage,
        is_charging,
      } = rows[0];

      motor_speed = parseInt(motor_speed, 10);
      battery_temperature = parseFloat(battery_temperature || 25);
      battery_percentage = parseFloat(battery_percentage);

      // Determine target temperature
      let targetTemp = SPEED_TEMP_MAP[motor_speed] || 25;

      // If battery is 0% or charging, cool down to 25
      if (battery_percentage <= 0 || is_charging) {
        targetTemp = 25; // Cool down
        motor_speed = 0; // Ensure motor is off
      }

      // Adjust the battery temperature
      let newTemp = battery_temperature;
      if (newTemp < targetTemp) {
        newTemp += 1; // Gradual heating
      } else if (newTemp > targetTemp) {
        newTemp -= 1; // Gradual cooling
      }

      // If temperature stabilizes at 25°C, stop the service (optional)
      if (
        newTemp === 25 &&
        motor_speed === 0 &&
        battery_percentage > 0 &&
        !is_charging
      ) {
        await db.query(`
          UPDATE dashboard
          SET battery_temperature = 25.0
          WHERE id = $1
        `, [id]);

        const { rows: updatedRows } = await db.query('SELECT * FROM dashboard WHERE id=$1', [id]);
        broadcast(updatedRows[0]);

        clearInterval(intervalId);
        delete temperatureJobs[id];
        return;
      }

      // Update the database with the new temperature
      const updateQuery = `
        UPDATE dashboard
        SET battery_temperature = $1
        WHERE id = $2
        RETURNING *
      `;
      const { rows: updatedRows } = await db.query(updateQuery, [newTemp, id]);
      broadcast(updatedRows[0]);

    } catch (err) {
      console.error('Error in temperature interval:', err);
      clearInterval(intervalId);
      delete temperatureJobs[id];
    }
  }, 1000); // Adjust interval as needed

  temperatureJobs[id] = intervalId;
}

function stopTemperatureService(id) {
  if (temperatureJobs[id]) {
    clearInterval(temperatureJobs[id]);
    delete temperatureJobs[id];
  }
}

module.exports = {
  startTemperatureService,
  stopTemperatureService,
  temperatureJobs,
};