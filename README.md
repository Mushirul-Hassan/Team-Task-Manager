# 📋 Team Task Manager

A full-stack project management web app where Admins can create projects, assign tasks to Members, and track progress — with role-based access control, JWT authentication, and a live dashboard.

🔗 **Live Demo:** [team-task-manager-ntkh.vercel.app](https://team-task-manager-ntkh.vercel.app)

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Role-Based Access](#role-based-access)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## ✨ Features

- 🔐 **Authentication** — Register & Login with JWT-based auth and bcrypt password hashing
- 👥 **Role-Based Access Control** — Admin and Member roles with different permissions
- 📁 **Project Management** — Create projects, manage team members per project
- ✅ **Task Management** — Create tasks, assign to members, set due dates
- 📊 **Dashboard** — View all tasks with status stats (Total, In Progress, Completed, Overdue)
- ⚠️ **Overdue Detection** — Tasks past their due date are automatically flagged
- 📈 **Project Progress** — Visual progress bar per project based on completed tasks
- 🔄 **Status Updates** — Members can update status of their own tasks in real time

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| Next.js 15 (App Router) | Frontend framework & routing |
| Tailwind CSS | Styling |
| Axios | HTTP client with auto token injection |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Railway | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
taskmanager/
├── taskmanager-backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & Login logic
│   │   ├── projectController.js   # Project CRUD
│   │   ├── taskController.js      # Task CRUD + dashboard
│   │   └── userController.js      # User listing
│   ├── middleware/
│   │   └── auth.js                # protect & adminOnly middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── taskmanager-frontend/
    └── src/
        ├── app/
        │   ├── layout.jsx
        │   ├── page.jsx               # Redirects to /login
        │   ├── login/
        │   │   └── page.jsx
        │   ├── register/
        │   │   └── page.jsx
        │   └── dashboard/
        │       ├── page.jsx           # Task dashboard
        │       ├── projects/
        │       │   ├── page.jsx       # All projects
        │       │   └── [id]/
        │       │       └── page.jsx   # Project detail + tasks
        │       └── admin/
        │           └── page.jsx       # Admin panel
        ├── components/
        │   └── Navbar.jsx
        └── lib/
            └── axios.js              # Axios instance with token interceptor
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskmanager.git
cd taskmanager
```

### 2. Setup Backend

```bash
cd taskmanager-backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key
PORT=5000
```

Start the backend:
```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Setup Frontend

```bash
cd taskmanager-frontend
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/taskmanager` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `mysupersecretkey123` |
| `PORT` | Port for the Express server | `5000` |

### Frontend (`.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/me` | Any | Get logged-in user profile |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/projects` | Admin | Create a project |
| GET | `/api/projects` | Any | Get all accessible projects |
| GET | `/api/projects/:id` | Any | Get single project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| PUT | `/api/projects/:id/members` | Admin | Update project members |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tasks` | Admin | Create a task |
| GET | `/api/tasks/dashboard` | Any | Get dashboard tasks (with overdue flag) |
| GET | `/api/tasks?project=id` | Any | Get tasks by project |
| GET | `/api/tasks/:id` | Any | Get single task |
| PUT | `/api/tasks/:id` | Admin | Update full task |
| PUT | `/api/tasks/:id/status` | Any | Update task status |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

---

## 🔐 Role-Based Access

### Admin
- Access to all projects and tasks
- Can create/update/delete projects and tasks
- Can assign members to projects
- Can assign tasks to specific members
- Access to Admin Panel (`/dashboard/admin`)

### Member
- Can only see projects they are assigned to
- Can only see tasks assigned to them
- Can only update the status of their own tasks
- No access to Admin Panel

---

## 🌐 Deployment

### Backend → Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Set **Root Directory** to `taskmanager-backend`
4. Add environment variables in Railway **Variables** tab:
   ```
   MONGO_URI=...
   JWT_SECRET=...
   PORT=5000
   ```
5. Railway generates a public URL — copy it

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory** to `taskmanager-frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
   ```
4. Deploy

### MongoDB → Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Go to **Network Access** → Add `0.0.0.0/0` to allow all IPs
3. Go to **Database Access** → Create a user with read/write access
4. Click **Connect** → copy the connection string into `MONGO_URI`

---

## 👤 Author

**Mushirul**
- GitHub: [@YOUR_USERNAME](https://github.com/Mushirul-Hassan)

---


