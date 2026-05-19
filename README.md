# 🚀 Primetrade Task Manager API

A scalable REST API with JWT Authentication, Role-Based Access Control, and a React frontend — built as part of the Primetrade.ai Backend Developer Intern assignment.

---

## 🌐 Live Links

| Service | URL |
|---|---|
| Frontend | `https://rest-api-backend-iota.vercel.app` |
| Backend API | `https://primetrade-backend-8cvd.onrender.com` |
| Swagger Docs | `https://primetrade-backend-8cvd.onrender.com/api/docs` |

> ⚠️ The backend is hosted on Render's free tier and may take ~30 seconds to wake up on the first request.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon — serverless) |
| ORM | Prisma |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Frontend | React.js + Vite |
| HTTP Client | Axios |
| Routing | React Router DOM |
| Deployment | Render (backend) + Vercel (frontend) + Neon (DB) |

---

## 📁 Project Structure

```
primetrade-assignment/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB schema (User, Task, enums)
│   ├── src/
│   │   ├── config/
│   │   │   └── swagger.js         # Swagger configuration
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register & Login logic
│   │   │   ├── taskController.js  # CRUD logic for tasks
│   │   │   └── userController.js  # User profile & admin user list
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   └── roleMiddleware.js  # Admin-only guard
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── userRoutes.js
│   │   └── utils/
│   │       └── apiResponse.js     # Standardized response helpers
│   ├── .env.example
│   ├── render.yaml
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance with JWT interceptor
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx      # Protected route with full CRUD UI
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

---

## 🗄️ Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String                  // bcrypt hashed
  role      Role     @default(USER) // USER | ADMIN
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(PENDING) // PENDING | IN_PROGRESS | DONE
  userId      Int
  user        User       @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

---

## 📡 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login and get JWT token | ❌ |

### Tasks — `/api/v1/tasks`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/` | Create a new task | ✅ | USER |
| GET | `/` | Get my tasks | ✅ | USER |
| GET | `/:id` | Get a single task | ✅ | USER |
| PUT | `/:id` | Update a task | ✅ | USER |
| DELETE | `/:id` | Delete a task | ✅ | USER |
| GET | `/admin/all` | Get all users' tasks | ✅ | ADMIN |

### Users — `/api/v1/users`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/me` | Get my profile | ✅ | USER |
| GET | `/` | Get all users | ✅ | ADMIN |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL (local) or a free Neon account

### 1. Clone the repo
```bash
git clone https://github.com/suyash-jaiswal2/REST-API-Backend.git
cd primetrade-assignment
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/primetrade_db"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

Run database migrations:
```bash
npx prisma migrate dev --name init
```

Start the backend:
```bash
npm run dev
```

API running at: `http://localhost:5000`
Swagger docs at: `http://localhost:5000/api/docs`

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:
```bash
npm run dev
```

Frontend running at: `http://localhost:5173`

---

## 🔐 Security Practices

- Passwords hashed with **bcryptjs** (12 salt rounds) — never stored in plain text
- **JWT tokens** signed with a secret key, stored in localStorage on the client
- All protected routes verified via **Authorization: Bearer** header middleware
- Input validated and sanitized using **express-validator** before hitting DB
- Role-based middleware prevents non-admin users from accessing admin routes
- Prisma ORM prevents **SQL injection** by using parameterized queries

---

## 📈 Scalability Note

This project is intentionally structured to scale. Here's how:

### 1. API Versioning
All routes are prefixed with `/api/v1/`, allowing a future `/api/v2/` to be deployed alongside without breaking existing clients.

### 2. Modular Architecture
The controllers/routes/middleware pattern means new entities (e.g. products, invoices, teams) can be added as independent modules without touching existing code.

### 3. Database
Prisma ORM abstracts the database layer. Switching from PostgreSQL to PlanetScale, CockroachDB, or any other relational DB requires only a one-line change in `schema.prisma`.

### 4. Caching (Recommended Next Step)
Add **Redis** to cache frequently read endpoints (e.g. task lists, user profiles), reducing DB load under high traffic.

### 5. Containerization
The app can be wrapped in a `Dockerfile` and deployed as a container. This enables horizontal scaling — running multiple backend instances behind a load balancer (e.g. Nginx or AWS ALB) to handle spikes in traffic.

### 6. Microservices Path
As the app grows, the monolith can be split into:
- `auth-service` — handles registration, login, token refresh
- `task-service` — handles CRUD for tasks
- `user-service` — handles profile and admin management

These can communicate via REST or a message queue (e.g. RabbitMQ, Kafka) and sit behind an **API Gateway**.

### 7. Logging & Monitoring
Integrate **Winston** or **Morgan** for structured logging. Add **Sentry** for error tracking in production.

---

## 👤 Author

**Your Name**
- GitHub: [@suyash-jaiswal2](https://github.com/suyash-jaiswal2)
- Email: youremail@example.com
