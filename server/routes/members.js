const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/members/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, tier, subscription_status,
       goal, age, weight_lbs, height_inches, created_at FROM members WHERE id=$1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/members/profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { first_name, last_name, goal, age, weight_lbs, height_inches } = req.body;
  try {
    const result = await pool.query(
      `UPDATE members SET first_name=$1, last_name=$2, goal=$3, age=$4,
       weight_lbs=$5, height_inches=$6, updated_at=NOW() WHERE id=$7
       RETURNING id, email, first_name, last_name, goal, age, weight_lbs, height_inches`,
      [first_name, last_name, goal, age, weight_lbs, height_inches, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/members/checkin
router.post('/checkin', authMiddleware, async (req, res) => {
  const { weight_lbs, notes } = req.body;
  try {
    await pool.query(
      'INSERT INTO check_ins (member_id, weight_lbs, notes) VALUES ($1,$2,$3)',
      [req.user.id, weight_lbs, notes]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/members/checkins
router.get('/checkins', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM check_ins WHERE member_id=$1 ORDER BY checked_in_at DESC LIMIT 30',
      [req.user.id]
    );
    res.json({ checkins: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
