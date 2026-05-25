const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, initDB } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Initialize DB on first load
initDB().catch(console.error);

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name, goal } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const existing = await pool.query('SELECT id FROM members WHERE email=$1', [email]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO members (email, password_hash, first_name, last_name, goal)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, email, first_name, last_name, tier, is_admin`,
      [email, password_hash, first_name || '', last_name || '', goal || null]
    );
    const member = result.rows[0];
    const token = jwt.sign(
      { id: member.id, email: member.email, tier: member.tier, is_admin: member.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ token, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await pool.query('SELECT * FROM members WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const member = result.rows[0];
    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: member.id, email: member.email, tier: member.tier, is_admin: member.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({
      token,
      member: {
        id: member.id, email: member.email,
        first_name: member.first_name, last_name: member.last_name,
        tier: member.tier, is_admin: member.is_admin,
        subscription_status: member.subscription_status, goal: member.goal
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, tier, is_admin, subscription_status, goal FROM members WHERE id=$1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
