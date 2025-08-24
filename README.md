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
PORT=4000
NODE_ENV=development
JWT_SECRET=supersecret_jwt_key_change_me
JWT_EXPIRES_IN=1d
DB_HOST=localhost
DB_NAME=u211781913_pharmacy
DB_USER=u211781913_Pharmacy
DB_PASS=Deva2025@
DB_DIALECT=mysql
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

The app auto-creates the `users` table using `sequelize.sync()` on startup.

## API
- Health: GET `/` (no auth)
- Auth:
  - POST `/api/auth/register` { name, email, password, role? }
  - POST `/api/auth/login` { email, password }
- Users (JWT required):
  - GET `/api/users` (admin only)
  - POST `/api/users` (admin only)
  - GET `/api/users/{id}` (self or admin)
  - PUT `/api/users/{id}` (self or admin)
  - DELETE `/api/users/{id}` (admin only)

### Examples
Register:
```
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Admin","email":"admin@example.com","password":"Secret123","role":"admin"}'
```

Login:
```
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Secret123"}' | jq -r .token)
```

List users (admin):
```
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/users
```

## Development Notes
- Uses PBKDF2 for password hashing (`src/utils/password.js`).
- Sequelize models in `src/models`. Connection config in `src/setup/database.js`.
- Routes in `src/routes`, controllers in `src/controllers`.
- To use sequelize-cli (optional), a `.sequelizerc` is included and `config/config.cjs` uses `.env`.
