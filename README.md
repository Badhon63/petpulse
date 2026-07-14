# PetPulse — Frontend

Next.js (App Router) + TypeScript frontend for PetPulse, a marketplace for buying and selling pets, pet food, and pet accessories.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts (admin/user dashboard analytics)
- better-auth (authentication, sessions, JWT)
- Stripe (checkout & payments)
- react-toastify (notifications)

## Features

### Public

- Home page with hero, features, and multiple info sections
- Explore page — search, filter (category, price), sort, and pagination
- Product details page with owner-based actions
- About, Contact, FAQ pages

### Authentication

- Register / Login with validation
- Demo login (auto-fill credentials)
- Role-based access (user / admin)

### User Dashboard

- Overview with activity stats and charts
- My Products — add, view, delete listings
- My Orders — purchase history and payment status
- Manage Orders — track and update orders received as a seller
- Payments — payment history
- Profile — view and edit account info

### Admin Dashboard

- Overview with platform-wide stats and charts
- Manage Users — view, ban/unban, delete
- Manage Products — view, approve/set pending, delete
- Manage Orders — view all orders, update delivery status

### Checkout

- Stripe-powered checkout flow
- Order created automatically on successful payment

## Related Repos
