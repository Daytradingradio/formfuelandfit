const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const PRICE_IDS = {
  essential: process.env.STRIPE_PRICE_ESSENTIAL,
  pro: process.env.STRIPE_PRICE_PRO,
  elite: process.env.STRIPE_PRICE_ELITE
};

// POST /api/stripe/checkout  — create Stripe checkout session
router.post('/checkout', authMiddleware, async (req, res) => {
  const { tier } = req.body;
  const priceId = PRICE_IDS[tier];
  if (!priceId) return res.status(400).json({ error: 'Invalid tier' });

  try {
    const memberRes = await pool.query('SELECT * FROM members WHERE id=$1', [req.user.id]);
    const member = memberRes.rows[0];

    let customerId = member.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.email,
        name: `${member.first_name} ${member.last_name}`.trim(),
        metadata: { member_id: String(member.id) }
      });
      customerId = customer.id;
      await pool.query('UPDATE members SET stripe_customer_id=$1 WHERE id=$2', [customerId, member.id]);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.APP_URL}/pricing?checkout=cancelled`,
      metadata: { member_id: String(member.id), tier }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/stripe/portal — customer billing portal
router.post('/portal', authMiddleware, async (req, res) => {
  try {
    const memberRes = await pool.query('SELECT stripe_customer_id FROM members WHERE id=$1', [req.user.id]);
    const customerId = memberRes.rows[0]?.stripe_customer_id;
    if (!customerId) return res.status(400).json({ error: 'No billing account found' });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard`
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});

// POST /api/stripe/webhook — Stripe events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  if (event.type === 'checkout.session.completed') {
    const { member_id, tier } = session.metadata;
    await pool.query(
      `UPDATE members SET tier=$1, subscription_status='active',
       stripe_subscription_id=$2, updated_at=NOW() WHERE id=$3`,
      [tier, session.subscription, member_id]
    );
  }

  if (event.type === 'customer.subscription.deleted') {
    await pool.query(
      `UPDATE members SET subscription_status='inactive', updated_at=NOW()
       WHERE stripe_subscription_id=$1`,
      [session.id]
    );
  }

  if (event.type === 'customer.subscription.updated') {
    const status = session.status === 'active' ? 'active' : 'inactive';
    await pool.query(
      `UPDATE members SET subscription_status=$1, updated_at=NOW()
       WHERE stripe_subscription_id=$2`,
      [status, session.id]
    );
  }

  res.json({ received: true });
});

module.exports = router;
