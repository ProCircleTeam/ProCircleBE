# ProCircleBE

# ProCircleBE

## Overview
ProCircleBE is the backend for the ProCircle application, built with Node.js, Express, and Sequelize. It provides user authentication, user management, and goal management functionalities.

## Endpoints
- **Auth**
  - `POST /api/v1/auth/signup` - Register a new user
  - `POST /api/v1/auth/signin` - Login a user
- **User**
  - `GET /api/v1/user/:id` - Get user by ID
- **Goal**
  - `POST /api/v1/goal` - Create a new weekly goal set
  - `PUT /api/v1/goal/:id` - Update a pending goal set
  - `GET /api/v1/goal` - Get all user goals (with pagination)
  - `GET /api/v1/goal/:id` - Get a single goal by ID
  - `GET /api/v1/goal/by-date?date=yyyy-mm-dd` - Get user goals by date (returns goals for the week containing the specified date)

  - `PATCH /api/v1/goal/:id/complete` - Mark a goal as completed

## Setup
1. Install dependencies: `npm install`
2. Create a `.env` file based on the example above
3. Run migrations: `npx sequelize-cli db:migrate`
4. Start the server: `npm run dev`
