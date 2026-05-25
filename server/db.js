const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      tier VARCHAR(20) DEFAULT 'essential',
      stripe_customer_id VARCHAR(100),
      stripe_subscription_id VARCHAR(100),
      subscription_status VARCHAR(20) DEFAULT 'inactive',
      goal VARCHAR(50),
      age INT,
      weight_lbs NUMERIC,
      height_inches NUMERIC,
      notes TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS workout_plans (
      id SERIAL PRIMARY KEY,
      member_id INT REFERENCES members(id) ON DELETE CASCADE,
      title VARCHAR(200),
      goal VARCHAR(50),
      weeks INT DEFAULT 4,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS workout_days (
      id SERIAL PRIMARY KEY,
      plan_id INT REFERENCES workout_plans(id) ON DELETE CASCADE,
      day_number INT,
      day_name VARCHAR(50),
      focus VARCHAR(100),
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id SERIAL PRIMARY KEY,
      day_id INT REFERENCES workout_days(id) ON DELETE CASCADE,
      name VARCHAR(200),
      sets INT,
      reps VARCHAR(50),
      rest_seconds INT,
      weight_note VARCHAR(100),
      video_url VARCHAR(500),
      order_index INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS workout_logs (
      id SERIAL PRIMARY KEY,
      member_id INT REFERENCES members(id) ON DELETE CASCADE,
      exercise_id INT REFERENCES exercises(id),
      logged_sets INT,
      logged_reps VARCHAR(50),
      logged_weight NUMERIC,
      notes TEXT,
      logged_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS nutrition_plans (
      id SERIAL PRIMARY KEY,
      member_id INT REFERENCES members(id) ON DELETE CASCADE,
      title VARCHAR(200),
      calories INT,
      protein_g INT,
      carbs_g INT,
      fats_g INT,
      notes TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS meal_templates (
      id SERIAL PRIMARY KEY,
      nutrition_plan_id INT REFERENCES nutrition_plans(id) ON DELETE CASCADE,
      meal_name VARCHAR(100),
      meal_time VARCHAR(50),
      foods JSONB,
      calories INT,
      protein_g INT,
      carbs_g INT,
      fats_g INT,
      order_index INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS check_ins (
      id SERIAL PRIMARY KEY,
      member_id INT REFERENCES members(id) ON DELETE CASCADE,
      weight_lbs NUMERIC,
      notes TEXT,
      photo_url VARCHAR(500),
      checked_in_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      member_id INT REFERENCES members(id) ON DELETE CASCADE,
      sender VARCHAR(10) NOT NULL CHECK (sender IN ('member', 'sawyer')),
      body TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(50) DEFAULT 'training',
      video_url VARCHAR(500) NOT NULL,
      thumbnail_url VARCHAR(500),
      duration_seconds INT,
      is_published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed sample videos if none exist
  const videoCount = await pool.query('SELECT COUNT(*) FROM videos');
  if (parseInt(videoCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO videos (title, description, category, video_url, duration_seconds) VALUES
      ('How to Do a Perfect Squat', 'Master squat form from setup to lockout. Foot placement, depth, bracing — all of it.', 'training', 'https://www.youtube.com/embed/ultWZbUMPL8', 480),
      ('Bench Press Form & Technique', 'Build a bigger chest the right way. Grip, arch, leg drive, and bar path explained.', 'training', 'https://www.youtube.com/embed/vcBig73ojpE', 420),
      ('Pull Up Progression for Beginners', 'Zero to 10 pull ups. Every step of the way with regressions and progressions.', 'training', 'https://www.youtube.com/embed/eGo4IYlbE5g', 360),
      ('Deadlift 101 — Setup & Execution', 'The most important lift you can do. Set up right and pull safe every time.', 'training', 'https://www.youtube.com/embed/op9kVnSso6Q', 540),
      ('How to Calculate Your Macros', 'Protein, carbs, and fats — exactly how much you need based on your goal.', 'nutrition', 'https://www.youtube.com/embed/a_WJRoMEKb8', 600),
      ('Meal Prep for Muscle Building', 'A full week of meals prepped in 2 hours. High protein, affordable, and actually tasty.', 'nutrition', 'https://www.youtube.com/embed/eFoEhSnJNaI', 720),
      ('Best Foods for Fat Loss', 'The foods that keep you full, fuel your workouts, and help you drop body fat faster.', 'nutrition', 'https://www.youtube.com/embed/lXJFPSIl7YQ', 480),
      ('Shoulder Training — Full Workout', 'Complete shoulder session for size and definition. All three heads covered.', 'training', 'https://www.youtube.com/embed/qEwKCR5JCog', 660)
    `);
    console.log('Sample videos seeded');
  }

  console.log('Database initialized');
};

module.exports = { pool, initDB };
