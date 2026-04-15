# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


----

# Book My Ticket — Frontend

A movie ticket booking platform built with React, Vite, and Tailwind CSS. Users can register, verify their email via OTP, browse movies, select seats, and complete bookings with a simple payment flow.

## What This Project Does

- User registration with email OTP verification
- JWT based login with access token and refresh token
- Browse movies and available show times
- Theatre style seat selection with real time seat locking
- Seat locking for 3 minutes while user completes payment
- Manual payment flow (no payment gateway)
- View all past bookings with seat numbers

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios (for API calls)
- React Router DOM (for routing)
- React Hot Toast (for notifications)
- Lucide React (for icons)
- Context API (for auth state management)

## Prerequisites

Before you start, make sure you have these installed on your machine:

- Node.js version 18 or above
- npm
- The backend server running (see backend repo)

## Getting Started

### Step 1 — Clone the repository

```bash
git clone https://github.com/koushik-karmakar/book-my-ticket-frontend.git
cd book-my-ticket-frontend
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create environment file

Create a `.env` file in the root of the project:

```env
VITE_API_URL=http://127.0.0.1:8000
```

If your backend is deployed on Render or any other platform, replace the URL with your deployed backend URL:

```env
VITE_API_URL=https://your-backend.hosting-platform.com
```

### Step 4 — Run the development server

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

## Project Structure

```
src/
├── api/
│   └── axios.js          — axios instance with token interceptor
├── context/
│   └── AuthContext.jsx   — global auth state using Context API
├── components/
│   ├── Navbar.jsx        — top navigation bar
│   └── ProtectedRoute.jsx — blocks unauthenticated access
├── pages/
│   ├── Register.jsx      — registration form
│   ├── VerifyOtp.jsx     — OTP verification with 5 min countdown
│   ├── Login.jsx         — login form
│   ├── Movies.jsx        — movie listing with show selection popup
│   ├── Seats.jsx         — theatre style seat map
│   ├── Payment.jsx       — order summary and payment
│   └── MyBookings.jsx    — user booking history
├── App.jsx               — routes setup
└── main.jsx              — app entry point
```

## How The App Works

### Registration Flow

1. User fills in first name, last name, email and password
2. Backend sends a 6 digit OTP to the email
3. User enters the OTP on the verify page within 5 minutes
4. After successful verification, user is redirected to login

### Login Flow

1. User enters email and password
2. Backend returns an access token and a refresh token
3. Both tokens are stored in localStorage
4. Access token is attached to every API request automatically
5. When access token expires, the app automatically uses the refresh token to get a new one without logging the user out

### Booking Flow

1. User browses movies on the movies page
2. Clicks Book Seats which opens a popup showing available show times
3. Selects a show time and is taken to the seat map
4. Seat map shows all 100 seats with their current status
   - Dark blue — available
   - Indigo — selected by you
   - Yellow — locked by another user
   - Red — already booked
5. User selects one or more seats and clicks Proceed to Pay
6. Selected seats are locked for 3 minutes in the backend
7. Payment page shows order summary
8. User clicks Pay and booking is confirmed instantly
9. If user cancels and goes back, seat locks are released immediately

## Pages Overview

| Page | Route | Protected |
|---|---|---|
| Register | /register | No |
| Verify OTP | /verify | No |
| Login | /login | No |
| Movies | /movies | Yes |
| Seats | /seats/:showId | Yes |
| Payment | /payment | Yes |
| My Bookings | /my-bookings | Yes |

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| VITE_API_URL | Your backend base URL | http://127.0.0.1:8080 |

## Connecting to Backend

This frontend expects the following API endpoints to be available on your backend:

```
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/resend-otp
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/movies
GET    /api/movies/:id

GET    /api/shows/movie/:movieId
GET    /api/shows/:id

GET    /api/seats/show/:showId

POST   /api/bookings/lock-seats
POST   /api/bookings/release-seats
POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/:id

POST   /api/payments/initiate
POST   /api/payments/confirm
POST   /api/payments/fail
```

Make sure your backend has CORS enabled for your frontend URL.

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with the production ready files.

## Deploying on Render

1. Push your code to GitHub
2. Go to render.com and create a new Static Site
3. Connect your GitHub repo
4. Set build command to `npm run build`
5. Set publish directory to `dist`
6. Add environment variable `VITE_API_URL` with your backend URL
7. Click Deploy

### Important — Fix page reload 404

When deployed, reloading any page other than home will show a 404 error. This is because React Router handles routes on the client side, but the server does not know about them.

To fix this, create a file called `_redirects` inside the `public` folder:

```
/*    /index.html    200
```

This tells Render to always serve `index.html` for any route and let React Router handle the rest.

## Common Issues

**Seats not loading**

Make sure your backend has demo data for screens, seats, shows and movies. Run this SQL on your database:

```sql
INSERT INTO screens (name, total_seats) VALUES ('Screen 1', 100);

INSERT INTO movies (title, description, duration, genre, language, rating, poster_url)
VALUES (
  'Dhurandhar The Revenge',
  'Jassi ko ghar ki yaad kyu nhi aai?',
  135, 'Action / Thriller', 'Hindi', 'U/A',
  'https://placehold.co/400x600?text=Dhurandhar'
);

INSERT INTO shows (movie_id, screen_id, show_time, price, status)
VALUES
  (1, 1, NOW() + INTERVAL '2 hours', 500, 'active'),
  (1, 1, NOW() + INTERVAL '5 hours', 500, 'active');
```

**Backend slow to respond on first request**

Render free tier spins down after 15 minutes of inactivity. The first request after that takes about 30 to 50 seconds. This is normal on the free tier. Use uptimerobot.com to ping your backend every 5 minutes to keep it warm.

**OTP not received**

Check your spam folder. Also make sure the backend has a valid Gmail app password set in its environment variables, not the regular Gmail password.

**Page reload shows 404**

Add the `_redirects` file inside the `public` folder as described in the deployment section above.

## Backend Repository

The backend for this project is built with Node.js, Express, and PostgreSQL.

Make sure to set up and run the backend before using this frontend. Refer to the backend repository for setup instructions.

## License

MIT
