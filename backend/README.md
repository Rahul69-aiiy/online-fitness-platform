# FitLive Backend Setup Guide

## Getting Started

1. **Prerequisites**
   - Node.js v20+
   - PostgreSQL database running locally or via Docker

2. **Setup Environment Variables**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your DATABASE_URL and secrets
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Setup Database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate -- --name init

   # Seed database with sample data
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

## API Testing

You can test the API using tools like Postman, curl, or the frontend.

**Test the health endpoint:**

```bash
curl http://localhost:5000/api/status
```

**Register a user:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123","role":"STUDENT"}'
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── middleware/
│   │   └── auth.js        # Auth middleware
│   ├── routes/
│   │   ├── auth.js        # Auth endpoints
│   │   ├── trainers.js    # Trainer endpoints
│   │   └── ...            # Other route files
│   ├── utils/
│   │   ├── tokens.js      # JWT utilities
│   │   └── seed.js        # Database seeding
│   └── server.js          # Entry point
├── package.json
└── .env.example
```
