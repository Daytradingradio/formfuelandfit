const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/nutrition/my-plan
router.get('/my-plan', authMiddleware, async (req, res) => {
  try {
    const planRes = await pool.query(
      `SELECT * FROM nutrition_plans WHERE member_id=$1 AND is_active=true ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );
    if (planRes.rows.length === 0) return res.json({ plan: null });

    const plan = planRes.rows[0];
    const mealsRes = await pool.query(
      'SELECT * FROM meal_templates WHERE nutrition_plan_id=$1 ORDER BY order_index',
      [plan.id]
    );
    res.json({ plan: { ...plan, meals: mealsRes.rows } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
