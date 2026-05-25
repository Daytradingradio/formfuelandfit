require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const adminRoutes = require('./routes/admin');
const stripeRoutes = require('./routes/stripe');
const workoutRoutes = require('./routes/workouts');
const nutritionRoutes = require('./routes/nutrition');

const app = express();
const PORT = process.env.PORT || 3000;

// Raw body needed for Stripe webhooks — must come before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Serve React frontend in production
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Form, Fuel & Fit server running on port ${PORT}`);
});
