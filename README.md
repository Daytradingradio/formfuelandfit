# Form, Fuel & Fit

Sawyer Kurisko's online personal training platform.

## Stack
- **Backend:** Node.js / Express / Postgres
- **Frontend:** React / Vite
- **Payments:** Stripe subscriptions
- **Deploy:** Render (GitHub auto-deploy)

## Local Development

```bash
# Install backend deps
cd server && npm install

# Install frontend deps
cd ../client && npm install

# Create your .env file in /server
cp .env.example .env
# Fill in your values

# Run backend (port 3000)
cd server && npm run dev

# Run frontend (port 5173) in separate terminal
cd client && npm run dev
```

## Deploy to Render

1. Push this repo to GitHub (e.g. `Daytradingradio/formfuelandfit`)
2. Go to render.com → New → Blueprint
3. Connect your repo — Render will read `render.yaml` and create:
   - Web service (Node app)
   - Postgres database
4. Add your env vars in Render dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_ESSENTIAL`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ELITE`
   - `APP_URL` (your Render URL or custom domain)

## Set Admin Account

After first deploy, run this SQL in Render's Postgres console:
```sql
UPDATE members SET is_admin = true WHERE email = 'sawyer@formfuelandfit.com';
```

## Stripe Setup

1. Create 3 products in Stripe dashboard:
   - Essential — $30/mo recurring
   - Pro — $75/mo recurring
   - Elite — $150/mo recurring
2. Copy the Price IDs into your Render env vars
3. Add webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`

## Custom Domain (formfuelandfit.com)

In your domain registrar (GoDaddy/Namecheap):
- Add CNAME record: `www` → your-render-app.onrender.com
- Or A record pointing to Render's IP
- In Render: Settings → Custom Domains → add formfuelandfit.com
