# ShopNest Backend

The backend is an Express API backed by MongoDB and Mongoose. It provides authentication, product, order, payment, and analytics endpoints for the ShopNest frontend.

## Requirements

- Node.js and npm
- A MongoDB database, local or hosted

## Install and Configure

From this directory, install dependencies:

```bash
npm install
```

Create a `.env` file in `backend/`, using `.env.example` as a reference. Configure at least:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password
```

`MONGO_URI` and `JWT_SECRET` are needed by the application. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are required by the seed script. Set `FRONTEND_URL` for a deployed frontend, and configure the email, Cloudinary, and Razorpay variables when using those integrations. Keep real credentials in `.env`; do not commit them.

## Run the API

Start the development server with automatic restarts:

```bash
npm run dev
```

Start without the development watcher:

```bash
npm start
```

The API defaults to port `5000`. In development, `GET /` returns a message confirming that the API is running.

## Seed Development Data

Run the seed script from this directory:

```bash
npm run seed
```

> **Warning:** Seeding permanently deletes every existing user and product in the configured database before inserting the sample data and admin account. It does not delete orders. Use only with a development or otherwise disposable database.

The admin email and password come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`; the password is hashed before it is stored. The script inserts sample products across the store's categories. Product images use external image URLs.

## API Routes

| Route prefix     | Purpose                                                                       |
| ---------------- | ----------------------------------------------------------------------------- |
| `/api/auth`      | Registration, login, OTP verification, password reset, and admin user listing |
| `/api/products`  | Product listing and details; admin product management                         |
| `/api/orders`    | Order creation, customer order history, and admin order management            |
| `/api/payment`   | Payment order creation and verification                                       |
| `/api/analytics` | Admin sales and store analytics                                               |

Most administrative endpoints require a valid user token and the admin role. Configure payment and email provider credentials to use those integrations.
