const express = require('express');
const { pool } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/messages — member gets their thread
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM messages WHERE member_id=$1 ORDER BY created_at ASC`,
      [req.user.id]
    );
    await pool.query(
      `UPDATE messages SET is_read=true WHERE member_id=$1 AND sender='sawyer' AND is_read=false`,
      [req.user.id]
    );
    res.json({ messages: result.rows });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/messages — member sends message
router.post('/', authMiddleware, async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Message required' });
  try {
    const result = await pool.query(
      `INSERT INTO messages (member_id, sender, body) VALUES ($1, 'member', $2) RETURNING *`,
      [req.user.id, body.trim()]
    );
    res.json({ message: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/messages/unread-count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM messages WHERE member_id=$1 AND sender='sawyer' AND is_read=false`,
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: GET all threads summary
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.member_id, mem.first_name, mem.last_name, mem.email,
       MAX(m.created_at) as last_message,
       COUNT(CASE WHEN m.sender='member' AND m.is_read=false THEN 1 END) as unread_count,
       (SELECT body FROM messages WHERE member_id=m.member_id ORDER BY created_at DESC LIMIT 1) as last_body
       FROM messages m JOIN members mem ON mem.id = m.member_id
       GROUP BY m.member_id, mem.first_name, mem.last_name, mem.email
       ORDER BY last_message DESC`
    );
    res.json({ threads: result.rows });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: GET full thread for a member
router.get('/admin/:member_id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM messages WHERE member_id=$1 ORDER BY created_at ASC`,
      [req.params.member_id]
    );
    await pool.query(
      `UPDATE messages SET is_read=true WHERE member_id=$1 AND sender='member' AND is_read=false`,
      [req.params.member_id]
    );
    res.json({ messages: result.rows });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: POST reply to member
router.post('/admin/:member_id', authMiddleware, adminMiddleware, async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Message required' });
  try {
    const result = await pool.query(
      `INSERT INTO messages (member_id, sender, body) VALUES ($1, 'sawyer', $2) RETURNING *`,
      [req.params.member_id, body.trim()]
    );
    res.json({ message: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
