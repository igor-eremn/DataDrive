const db = require('./db');

const chargingJobs = {};

async function startCharging(id, broadcast) {
  if (chargingJobs[id]) {
    clearInterval(chargingJobs[id]);
  }

  const intervalId = setInterval(async () => {
    try {
      const selectQuery = 'SELECT battery_percentage, is_charging FROM dashboard WHERE id=$1';
      const { rows } = await db.query(selectQuery, [id]);
      if (rows.length === 0) {
        clearInterval(intervalId);
        delete chargingJobs[id];
        return;
      }

      let { battery_percentage, is_charging } = rows[0];
      battery_percentage = parseFloat(battery_percentage);

      if (!is_charging || battery_percentage >= 100) {
        clearInterval(intervalId);
        delete chargingJobs[id];

        if (battery_percentage >= 100) {
          await db.query(
            'UPDATE dashboard SET battery_percentage=100.0, is_charging=false WHERE id=$1',
            [id]
          );
          const { rows: updatedRows } = await db.query('SELECT * FROM dashboard WHERE id=$1', [id]);
          broadcast(updatedRows[0]);
        }
        return;
      }

      const newBattery = battery_percentage + 1;
      const updateQuery = 'UPDATE dashboard SET battery_percentage=$1 WHERE id=$2 RETURNING *';
      const { rows: updated } = await db.query(updateQuery, [newBattery, id]);

      broadcast(updated[0]);
    } catch (err) {
      console.error('Error in charging interval:', err);
      clearInterval(intervalId);
      delete chargingJobs[id];
    }
  }, 3000);

  chargingJobs[id] = intervalId;
}

function stopCharging(id) {
  if (chargingJobs[id]) {
    clearInterval(chargingJobs[id]);
    delete chargingJobs[id];
  }
}

module.exports = {
  startCharging,
  stopCharging,
  chargingJobs,
};