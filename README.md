# Hapi Pharmacy API

Node.js Hapi server with MySQL (via Sequelize) and JWT authentication. Includes:
- @hapi/hapi server with JWT auth (@hapi/jwt)
- Input validation with @hapi/joi
- Sequelize ORM (mysql2) with PBKDF2 password hashing
- CRUD for users (admin protected) and auth endpoints (register/login)

## Requirements
- Node.js 18+
- MySQL 5.7+/8+

## Setup
1. Copy `.env` and adjust if needed (already filled with your DB creds):
```
PORT=
NODE_ENV=
JWT_SECRET=
JWT_EXPIRES_IN=
DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=
DB_DIALECT=
DB_LOGGING=false
```

2. Install dependencies:
```
npm install
```

3. Start the dev server:
```
npm run dev
```
Server will run at: http://localhost:4000
