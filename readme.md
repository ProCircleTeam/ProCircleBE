# ProCircleBE

> procircle api

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST http://localhost:3030/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password",
  "name": "John Doe"
}
```
Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "code_name": "Maverick",  // Randomly assigned unique code name
  "createdAt": "2024-05-19T22:45:51.000Z"
}
```

#### Login
```http
POST http://localhost:3030/authentication
Content-Type: application/json

{
  "strategy": "local",
  "email": "user@example.com",
  "password": "your-password"
}
```
Response:
```json
{
  "accessToken": "your-jwt-token",
  "authentication": {
    "strategy": "local"
  },
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "code_name": "Maverick"
  }
}
```

### Goals Endpoints

All goals endpoints require authentication. Add the JWT token to the Authorization header:
```http
Authorization: Bearer your-jwt-token
```

#### Create Goal
```http
POST http://localhost:3030/goals
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "text": "Learn TypeScript"
}
```
Response:
```json
{
  "id": 1,
  "text": "Learn TypeScript",
  "userId": 1,
  "createdAt": "2024-05-19T22:45:51.000Z",
  "updatedAt": "2024-05-19T22:45:51.000Z"
}
```

#### List Goals
```http
GET http://localhost:3030/goals
Authorization: Bearer your-jwt-token
```

#### Get Single Goal
```http
GET http://localhost:3030/goals/1
Authorization: Bearer your-jwt-token
```

#### Update Goal
```http
PATCH http://localhost:3030/goals/1
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "text": "Learn TypeScript and Node.js"
}
```

#### Delete Goal
```http
DELETE http://localhost:3030/goals/1
Authorization: Bearer your-jwt-token
```

## Setup Instructions

### 1. Prerequisites
- [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed
- [PostgreSQL](https://www.postgresql.org/) installed locally, or access to a remote PostgreSQL database

### 2.Setup ENV from .env.sample and Configure Database
- **Option A: Local PostgreSQL**
  1. Create a database named `ProCircleBE`:
     ```sh
     createdb -U postgres ProCircleBE
     ```
  2. Set your local PostgreSQL username and password in your environment. You can copy `.env.sample` to `.env` and set:
     ```env
     DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/ProCircleBE
     ```
     Replace `yourpassword` with your actual PostgreSQL password.

- **Option B: Remote PostgreSQL**
  1. Set your remote database URL in `.env`:
     ```env
     DATABASE_URL=your-remote-db-url
     ```

### 3. Install Dependencies
```sh
npm install
```

### 4. Run Database Migrations
```sh
npx knex migrate:latest --knexfile knexfile.ts
```

### 5. Start the App
```sh
npm start
```

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```
$ npx feathers help                           # Show all commands
$ npx feathers generate service               # Generate a new Service
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
