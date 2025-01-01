const express = require('express');
const router = express.Router();
const db = require('./db');

const setupRoutes = (broadcast) => {
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

  router.post('/set-battery/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { percentage } = req.body;

      const queryText =
        'UPDATE dashboard SET battery_percentage=$1 WHERE id=$2 RETURNING *';
      const { rows } = await db.query(queryText, [percentage, id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      console.log('🔋 Battery Percentage Updated:', rows[0]);
      broadcast(rows[0]);

      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating battery:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/toggle-charging/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const getStateQuery = 'SELECT is_charging FROM dashboard WHERE id=$1';
      const { rows: stateRows } = await db.query(getStateQuery, [id]);

      if (stateRows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      const currentChargingState = stateRows[0].is_charging;
      const newChargingState = !currentChargingState;

      const updateQuery =
        'UPDATE dashboard SET is_charging=$1 WHERE id=$2 RETURNING *';
      const { rows: updateRows } = await db.query(updateQuery, [
        newChargingState,
        id,
      ]);

      if (updateRows.length === 0) {
        return res.status(404).json({ error: 'Failed to update the record' });
      }

      console.log('🔋 Charging State Updated:', newChargingState);

      broadcast(updateRows[0]);

      res.json(updateRows[0]);
    } catch (err) {
      console.error('Error toggling charging state:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/update-speed/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { speed } = req.body;
  
      if (speed < 0 || speed > 4) {
        return res.status(400).json({ error: 'Invalid speed. Must be between 0 and 4.' });
      }
  
      const queryText = 'UPDATE dashboard SET motor_speed=$1 WHERE id=$2 RETURNING *';
      const { rows } = await db.query(queryText, [speed, id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      console.log('📊 Motor Speed Updated:', rows[0].motor_speed);
  
      broadcast(rows[0]);
  
      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating motor speed:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};

module.exports = setupRoutes;