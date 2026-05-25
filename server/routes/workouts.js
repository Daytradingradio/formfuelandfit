const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/workouts/my-plan — get member's active workout plan
router.get('/my-plan', authMiddleware, async (req, res) => {
  try {
    const planRes = await pool.query(
      `SELECT * FROM workout_plans WHERE member_id=$1 AND is_active=true ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );
    if (planRes.rows.length === 0) return res.json({ plan: null });

    const plan = planRes.rows[0];
    const daysRes = await pool.query(
      'SELECT * FROM workout_days WHERE plan_id=$1 ORDER BY day_number',
      [plan.id]
    );

    const days = await Promise.all(daysRes.rows.map(async (day) => {
      const exRes = await pool.query(
        'SELECT * FROM exercises WHERE day_id=$1 ORDER BY order_index',
        [day.id]
      );
      return { ...day, exercises: exRes.rows };
    }));

    res.json({ plan: { ...plan, days } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/workouts/log — log a completed exercise
router.post('/log', authMiddleware, async (req, res) => {
  const { exercise_id, logged_sets, logged_reps, logged_weight, notes } = req.body;
  try {
    await pool.query(
      `INSERT INTO workout_logs (member_id, exercise_id, logged_sets, logged_reps, logged_weight, notes)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [req.user.id, exercise_id, logged_sets, logged_reps, logged_weight, notes]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/workouts/logs — get member's recent workout logs
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT wl.*, e.name as exercise_name FROM workout_logs wl
       JOIN exercises e ON e.id = wl.exercise_id
       WHERE wl.member_id=$1 ORDER BY wl.logged_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json({ logs: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
