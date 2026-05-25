const express = require('express');
const { pool } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/sculpting — member gets their sculpting data
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM body_sculpting WHERE member_id=$1',
      [req.user.id]
    );
    res.json({ sculpting: result.rows[0] || null });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/sculpting — member saves their selections
router.post('/', authMiddleware, async (req, res) => {
  const { selected_muscles, sculpting_goals, priority_areas } = req.body;
  try {
    const existing = await pool.query(
      'SELECT id FROM body_sculpting WHERE member_id=$1', [req.user.id]
    );
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE body_sculpting SET selected_muscles=$1, sculpting_goals=$2,
         priority_areas=$3, updated_at=NOW() WHERE member_id=$4`,
        [JSON.stringify(selected_muscles), sculpting_goals,
         JSON.stringify(priority_areas), req.user.id]
      );
    } else {
      await pool.query(
        `INSERT INTO body_sculpting (member_id, selected_muscles, sculpting_goals, priority_areas)
         VALUES ($1,$2,$3,$4)`,
        [req.user.id, JSON.stringify(selected_muscles), sculpting_goals,
         JSON.stringify(priority_areas)]
      );
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: GET member's sculpting data
router.get('/admin/:member_id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM body_sculpting WHERE member_id=$1',
      [req.params.member_id]
    );
    res.json({ sculpting: result.rows[0] || null });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
