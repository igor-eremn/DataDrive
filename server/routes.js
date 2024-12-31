const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/dashboard', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM dashboard');
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
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating battery:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;