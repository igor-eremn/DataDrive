const express = require('express');
const router = express.Router();
const db = require('./db');

const { startCharging, stopCharging } = require('./chargingService');
const { startSpeedService, stopSpeedService } = require('./speedService');
const { startTemperatureService, stopTemperatureService } = require('./temperatureService');

const setupRoutes = (broadcast) => {
  
  // Fetch all records from the dashboard table 
  router.get('/dashboard', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM dashboard');
      console.log('Vehicle Dashboard Data Received');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Update the battery percentage for a dashboard record 
  router.post('/set-battery/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { percentage } = req.body;

      const queryText = 'UPDATE dashboard SET battery_percentage=$1 WHERE id=$2 RETURNING *';
      const { rows } = await db.query(queryText, [percentage, id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      console.log('🔋 Battery Percentage Updated:', rows[0].battery_percentage);
      broadcast(rows[0]);

      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating battery:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Toggle the charging state for a dashboard record
  router.post('/toggle-charging/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const getStateQuery = `
        SELECT is_charging, motor_speed
        FROM dashboard
        WHERE id = $1
      `;
      const { rows: stateRows } = await db.query(getStateQuery, [id]);
      if (stateRows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      const { is_charging, motor_speed } = stateRows[0];
      const newChargingState = !is_charging;
  
      if (newChargingState && motor_speed !== 0) {
        return res
          .status(400)
          .json({ error: 'Cannot start charging while motor speed is not 0.' });
      }
  
      const updateQuery = `
        UPDATE dashboard
        SET is_charging = $1
        WHERE id = $2
        RETURNING *
      `;
      const { rows: updateRows } = await db.query(updateQuery, [newChargingState, id]);
      if (updateRows.length === 0) {
        return res.status(404).json({ error: 'Failed to update the record' });
      }
  
      console.log('🔋 Charging State Updated:', newChargingState);
      broadcast(updateRows[0]);
  
      if (newChargingState) {
        startCharging(id, broadcast);
        startTemperatureService(id, broadcast);
      } else {
        stopCharging(id);
        startTemperatureService(id, broadcast);
      }
  
      res.json(updateRows[0]);
    } catch (err) {
      console.error('Error toggling charging state:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Update the motor speed and RPM for a dashboard record
  router.post('/update-speed/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { speed } = req.body;
  
      if (speed < 0 || speed > 4) {
        return res
          .status(400)
          .json({ error: 'Invalid speed. Must be between 0 and 4.' });
      }
  
      const baseRpm = speed * 200;
      const queryText = `
        UPDATE dashboard
        SET motor_speed = $1,
            motor_rpm = $2
        WHERE id = $3
        RETURNING *
      `;
      const { rows } = await db.query(queryText, [speed, baseRpm, id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      console.log('📊 Motor Speed and RPM Updated:', {
        motor_speed: rows[0].motor_speed,
        motor_rpm: rows[0].motor_rpm,
      });
  
      broadcast(rows[0]);
  
      if (speed === 0) {
        stopSpeedService(id);
        startTemperatureService(id, broadcast);
      } else {
        startSpeedService(id, broadcast);
        startTemperatureService(id, broadcast);
      }
  
      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating motor speed and RPM:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Retrieve the status indicators for a dashboard record
  router.get('/statuses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const queryText = `
        SELECT parking_brake, check_engine, motor_rpm, battery_percentage
        FROM dashboard
        WHERE id = $1
      `;
      const { rows } = await db.query(queryText, [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      const { parking_brake, check_engine, motor_rpm, battery_percentage } = rows[0];
      const statuses = {
        parkingBrake: parking_brake,
        checkEngine: check_engine,
        motorActive: motor_rpm > 700,
        lowBattery: parseFloat(battery_percentage) < 20,
      };

      console.log('Statuses Received');
      res.json(statuses);
    } catch (err) {
      console.error('Error fetching statuses:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};

module.exports = setupRoutes;