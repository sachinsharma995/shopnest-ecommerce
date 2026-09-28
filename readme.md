<div align="center">
   <h1>ShopNest</h1>
   <p>A full-stack MERN e-commerce application with a customer storefront and an admin dashboard.</p>
</div>

## Features

- Browse products, view product details, and manage a shopping cart.
- Register and sign in, verify registration by OTP, and reset forgotten passwords.
- Place orders and use the Razorpay payment integration when credentials are configured.
- View order history and manage a customer profile.
- Admin tools for products, orders, users, and sales analytics.
- Upload product images through Cloudinary.

## Technology

- Frontend: React 19, Vite, React Router, Redux Toolkit
- Backend: Node.js, Express 5
- Database: MongoDB with Mongoose
- Authentication: JSON Web Tokens
- Optional integrations: Razorpay, Cloudinary, Nodemailer

## Requirements

- Node.js and npm
- A MongoDB database, local or hosted
- Optional provider accounts and credentials for email, image uploads, and payments

## Setup

Install dependencies from the repository root and each application directory:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Create `backend/.env` using `backend/.env.example` as a starting point. At minimum, configure:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Set provider credentials in the same file when using email, Cloudinary uploads, or Razorpay. Never commit `.env` or real credentials.

## Run Locally

From the repository root, start the Vite frontend and Express backend together:

```bash
npm run dev
```

The frontend is served at `http://localhost:5173`; the API listens on `http://localhost:5000`. Vite proxies `/api` requests to the backend during development.

To build the frontend for production:

```bash
npm run build
```

## Seed Development Data

See [backend/README.md](backend/README.md) for the seed command and its database-reset warning. The seed script removes existing users and products before creating a configured admin account and sample products.

## Backend Notes

The API routes are mounted under `/api/auth`, `/api/products`, `/api/orders`, `/api/payment`, and `/api/analytics`. Backend setup, environment variables, and seed details are documented in [backend/README.md](backend/README.md).
