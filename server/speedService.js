const db = require('./db');

const speedJobs = {};

async function startSpeedService(id, broadcast) {
  if (speedJobs[id]) {
    clearInterval(speedJobs[id]);
  }

  const intervalId = setInterval(async () => {
    try {
      const selectQuery = `
        SELECT motor_speed, motor_rpm, battery_percentage, is_charging, power_consumption
        FROM dashboard
        WHERE id = $1
      `;
      const { rows } = await db.query(selectQuery, [id]);
      if (rows.length === 0) {
        clearInterval(intervalId);
        delete speedJobs[id];
        return;
      }

      let {
        motor_speed,
        motor_rpm,
        battery_percentage,
        is_charging,
        power_consumption
      } = rows[0];

      motor_speed = parseInt(motor_speed, 10);
      motor_rpm = parseInt(motor_rpm, 10);
      battery_percentage = parseFloat(battery_percentage);
      power_consumption = parseFloat(power_consumption || 0);

      if (motor_speed === 0 || battery_percentage <= 0 || is_charging) {
        if (battery_percentage <= 0) {
          battery_percentage = 0;
          motor_speed = 0;
          motor_rpm = 0;
          power_consumption = 0;

          await db.query(`
            UPDATE dashboard
            SET battery_percentage = 0.00,
                motor_speed = 0,
                motor_rpm = 0,
                power_consumption = 0.00
            WHERE id = $1
          `, [id]);

          const { rows: updatedRows } = await db.query('SELECT * FROM dashboard WHERE id=$1', [id]);
          broadcast(updatedRows[0]);
        } 
        else if (motor_speed === 0 && battery_percentage > 0) {
          await db.query(`
            UPDATE dashboard
            SET power_consumption = 0.00
            WHERE id = $1
          `, [id]);

          const { rows: updatedRows } = await db.query('SELECT * FROM dashboard WHERE id=$1', [id]);
          broadcast(updatedRows[0]);
        }

        clearInterval(intervalId);
        delete speedJobs[id];
        return;
      }

      const baseRpm = motor_speed * 200;
      const rpmFluctuation = Math.floor(Math.random() * 51) - 25;
      let newRpm = baseRpm + rpmFluctuation;
      if (newRpm < 0) newRpm = 0;

      let drainRate = 0.5 * motor_speed;
      if (drainRate < 0) drainRate = 0;

      let newBattery = battery_percentage - drainRate;
      if (newBattery < 0) newBattery = 0;

      let newPower = power_consumption;
      if (newPower === 0) {
        newPower = 1;
      } 
      else {
        const basePower = motor_speed * 200;
        const powerFluctuation = Math.floor(Math.random() * 21) - 10;
        newPower = basePower + powerFluctuation;
        if (newPower < 0) newPower = 0;
      }

      const updateQuery = `
        UPDATE dashboard
        SET motor_rpm = $1,
            battery_percentage = $2,
            power_consumption = $3
        WHERE id = $4
        RETURNING *
      `;
      const { rows: updatedRows } = await db.query(updateQuery, [
        newRpm,
        newBattery,
        newPower,
        id,
      ]);

      broadcast(updatedRows[0]);

    } catch (err) {
      console.error('Error in speed interval:', err);
      clearInterval(intervalId);
      delete speedJobs[id];
    }
  }, 1000);

  speedJobs[id] = intervalId;
}

function stopSpeedService(id) {
  if (speedJobs[id]) {
    clearInterval(speedJobs[id]);
    delete speedJobs[id];
  }
}

module.exports = {
  startSpeedService,
  stopSpeedService,
  speedJobs,
};