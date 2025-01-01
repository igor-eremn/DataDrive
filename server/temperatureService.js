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

      let targetTemp;
      if (is_charging) {
        targetTemp = Math.random() < 0.5 ? 31 : 33;
      } else if (motor_speed > 0) {
        const baseTemp = SPEED_TEMP_MAP[motor_speed] || 25;
        const maxTemp = baseTemp + 2;
        targetTemp = Math.floor(Math.random() * (maxTemp - baseTemp + 1)) + baseTemp;
      } else {
        targetTemp = 25;
      } 

      let newTemp = battery_temperature;
      if (newTemp < targetTemp) {
        newTemp += 1;
      } else if (newTemp > targetTemp) {
        newTemp -= 1;
      }

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
  }, 1500);

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