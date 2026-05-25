const express = require('express');
const { pool } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// GET /api/admin/members — list all members
router.get('/members', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, tier, subscription_status,
       goal, age, weight_lbs, height_inches, created_at, notes FROM members
       WHERE is_admin=false ORDER BY created_at DESC`
    );
    res.json({ members: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/members/:id — single member detail
router.get('/members/:id', async (req, res) => {
  try {
    const memberRes = await pool.query('SELECT * FROM members WHERE id=$1', [req.params.id]);
    if (!memberRes.rows.length) return res.status(404).json({ error: 'Not found' });

    const member = memberRes.rows[0];
    delete member.password_hash;

    const planRes = await pool.query(
      'SELECT * FROM workout_plans WHERE member_id=$1 ORDER BY created_at DESC',
      [member.id]
    );
    const nutritionRes = await pool.query(
      'SELECT * FROM nutrition_plans WHERE member_id=$1 ORDER BY created_at DESC',
      [member.id]
    );
    const checkinsRes = await pool.query(
      'SELECT * FROM check_ins WHERE member_id=$1 ORDER BY checked_in_at DESC LIMIT 10',
      [member.id]
    );

    res.json({
      member,
      workout_plans: planRes.rows,
      nutrition_plans: nutritionRes.rows,
      recent_checkins: checkinsRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/members/:id/notes — update admin notes on a member
router.put('/members/:id/notes', async (req, res) => {
  const { notes } = req.body;
  try {
    await pool.query('UPDATE members SET notes=$1, updated_at=NOW() WHERE id=$2', [notes, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/workout-plan — create a workout plan for a member
router.post('/workout-plan', async (req, res) => {
  const { member_id, title, goal, weeks, days } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deactivate old plans
    await client.query(
      'UPDATE workout_plans SET is_active=false WHERE member_id=$1',
      [member_id]
    );

    // Create new plan
    const planRes = await client.query(
      `INSERT INTO workout_plans (member_id, title, goal, weeks)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [member_id, title, goal, weeks || 4]
    );
    const planId = planRes.rows[0].id;

    // Insert days and exercises
    for (const day of (days || [])) {
      const dayRes = await client.query(
        `INSERT INTO workout_days (plan_id, day_number, day_name, focus, notes)
         VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [planId, day.day_number, day.day_name, day.focus, day.notes]
      );
      const dayId = dayRes.rows[0].id;

      for (let i = 0; i < (day.exercises || []).length; i++) {
        const ex = day.exercises[i];
        await client.query(
          `INSERT INTO exercises (day_id, name, sets, reps, rest_seconds, weight_note, video_url, order_index)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [dayId, ex.name, ex.sets, ex.reps, ex.rest_seconds, ex.weight_note, ex.video_url, i]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, plan_id: planId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// POST /api/admin/nutrition-plan — create a nutrition plan for a member
router.post('/nutrition-plan', async (req, res) => {
  const { member_id, title, calories, protein_g, carbs_g, fats_g, notes, meals } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE nutrition_plans SET is_active=false WHERE member_id=$1',
      [member_id]
    );

    const planRes = await client.query(
      `INSERT INTO nutrition_plans (member_id, title, calories, protein_g, carbs_g, fats_g, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [member_id, title, calories, protein_g, carbs_g, fats_g, notes]
    );
    const planId = planRes.rows[0].id;

    for (let i = 0; i < (meals || []).length; i++) {
      const m = meals[i];
      await client.query(
        `INSERT INTO meal_templates (nutrition_plan_id, meal_name, meal_time, foods, calories, protein_g, carbs_g, fats_g, order_index)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [planId, m.meal_name, m.meal_time, JSON.stringify(m.foods || []), m.calories, m.protein_g, m.carbs_g, m.fats_g, i]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, plan_id: planId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
