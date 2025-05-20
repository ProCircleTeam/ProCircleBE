# ProCircleBE

> procircle api

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

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
