# Project: Blog API

A Node.js RESTful API for managing users and blogs, built with Express, PostgreSQL, TypeScript, and Zod for validation.

## Features

- User registration and login with JWT authentication
- Blog CRUD operations (create, read, update, delete)
- Category management for blogs
- Input validation using Zod
- Secure password hashing with bcrypt
- PostgreSQL database integration
- Error handling middleware
- Cookie-based authentication

## Project Structure

```
src/
  index.ts                # Entry point
  controllers/            # Route handlers
  middleware/             # Custom middlewares
  migrations/             # DB migration scripts
  models/                 # TypeScript models & validation schemas
  routes/                 # Express routers
  services/               # Business logic
  tests/                  # Jest unit tests
  utils/                  # Utility functions (db, token, validation)
.env                      # Environment variables
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up your `.env` file:

   ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Database Migration

Initialize the database tables:

```sh
npm run init:db
```

To rollback (drop tables):

```sh
npm run delete:db
```

### Running the Server

Development mode (with ts-node):

```sh
npm run dev
```

Production build:

```sh
npm run build
npm start
```

### API Endpoints

#### User

- `POST /api/user/signUp` — Register a new user
- `POST /api/user/logIn` — Login and receive JWT token

#### Blogs

- `GET /api/blogs` — Get all blogs (optionally filter by categories)
- `POST /api/blogs/:id` — Add a new blog (authenticated)
- `PUT /api/blogs/:id` — Update a blog (authenticated)
- `DELETE /api/blogs/:id` — Delete a blog (authenticated)

## Testing

Run unit tests with Jest:

```sh
npm test
```

---
