const express = require('express');
const router = express.Router();
const db = require('./db');

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

    const queryText = 'UPDATE dashboard SET battery_percentage=$1 WHERE id=$2 RETURNING *';
    const { rows } = await db.query(queryText, [percentage, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    console.log('Battery Percentage Updated');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating battery:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/set-if-charging/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isCharging } = req.body;

    const queryText = 'UPDATE dashboard SET is_charging=$1 WHERE id=$2 RETURNING *';
    const { rows } = await db.query(queryText, [isCharging, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    console.log('Charging State Updated');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating charging state:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;