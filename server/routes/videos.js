const express = require('express');
const { pool } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/videos — all published videos (members)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    let q = `SELECT * FROM videos WHERE is_published=true`;
    const params = [];
    if (category && category !== 'all') {
      q += ` AND category=$1`;
      params.push(category);
    }
    q += ` ORDER BY created_at DESC`;
    const result = await pool.query(q, params);
    res.json({ videos: result.rows });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: GET all videos including unpublished
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM videos ORDER BY created_at DESC`);
    res.json({ videos: result.rows });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: POST create video
router.post('/admin', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, category, video_url, thumbnail_url, duration_seconds } = req.body;
  if (!title || !video_url) return res.status(400).json({ error: 'Title and video URL required' });
  try {
    const result = await pool.query(
      `INSERT INTO videos (title, description, category, video_url, thumbnail_url, duration_seconds)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, category || 'training', video_url, thumbnail_url, duration_seconds]
    );
    res.json({ video: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: PUT update video
router.put('/admin/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, category, video_url, thumbnail_url, duration_seconds, is_published } = req.body;
  try {
    const result = await pool.query(
      `UPDATE videos SET title=$1, description=$2, category=$3, video_url=$4,
       thumbnail_url=$5, duration_seconds=$6, is_published=$7 WHERE id=$8 RETURNING *`,
      [title, description, category, video_url, thumbnail_url, duration_seconds, is_published, req.params.id]
    );
    res.json({ video: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ADMIN: DELETE video
router.delete('/admin/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.query(`DELETE FROM videos WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
