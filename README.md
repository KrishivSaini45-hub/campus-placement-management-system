# Campus Placement Management System 🎓

A comprehensive, full-stack web application designed to streamline the campus recruitment process for students, recruiters, and college administrators.

![Application Overview](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)

## ✨ Features

The system is strictly governed by role-based access control (RBAC), ensuring users only interact with data relevant to their clearance.

### 👨‍🎓 Student Module
- **Live Dashboard**: Track total applications, shortlisted drives, and upcoming interviews.
- **Smart Eligibility Engine**: Browse active placement drives. The system automatically calculates your eligibility (CGPA, Backlogs, Branch, Graduation Year) and safely blocks invalid applications.
- **Application Tracking**: View real-time status updates (Applied, Shortlisted, Interview Scheduled, Selected, Rejected).
- **Offer Management**: Review job offers and accept/decline seamlessly.

### 👔 Recruiter Module
- **Drive Management**: Create and configure custom placement drives with strict eligibility parameters (salary, job type, minimum CGPA, branches).
- **Applicant Tracking System (ATS)**: Filter applicants, shortlist candidates, or reject them.
- **Interview Scheduling**: Schedule Technical/HR interviews with embedded meeting links.
- **Offer Generation**: Formally issue job offers directly to selected students.

### 🛡️ Admin Module (TPO)
- **Analytics Dashboard**: Dynamic Recharts visualizing placement rates, total drives, and application statuses.
- **Company Moderation**: Approve or revoke recruiter companies to prevent spam/unauthorized access.
- **User Management**: Monitor and optionally disable/enable student and recruiter accounts.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (v19)
- Vite (Fast bundler)
- Tailwind CSS v4 (Styling)
- React Router v7 (Client-side routing)
- Recharts (Data visualization)
- Axios (API Client)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- JSON Web Tokens (JWT) & bcrypt (Authentication/Security)
- Cloudinary (Resume/Asset storage)

---

## 📂 Project Structure

This project uses a monorepo structure separating the client and server.

```text
campus-placement-system/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Cards, Badges, Modals)
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── layouts/            # Dashboard layout & wrappers
│   │   ├── pages/              # Role-based Views
│   │   │   ├── admin/          # Admin Dashboard, Manage Users, etc.
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── recruiter/      # Recruiter Dashboard, Manage Drives, ATS
│   │   │   └── student/        # Student Dashboard, Profile, Active Drives
│   │   ├── services/           # Axios API configurations
│   │   ├── utils/              # Helper functions (Tailwind merge)
│   │   ├── App.jsx             # Route definitions & PrivateRoutes
│   │   └── index.css           # Tailwind v4 configuration & base styles
│   ├── .env                    # Frontend environment variables
│   ├── package.json
│   └── vercel.json             # Vercel SPA routing configuration
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # DB connection (db.js) & Cloudinary
│   │   ├── controllers/        # Business logic (auth, student, drives)
│   │   ├── middleware/         # Auth verification, Error Handling
│   │   ├── models/             # Mongoose Schemas
│   │   ├── routes/             # Express API routers
│   │   ├── services/           # Standalone services (Eligibility Engine)
│   │   ├── utils/              # Seed scripts and helpers
│   │   └── server.js           # Express App Entry Point
│   ├── .env                    # Backend secrets
│   └── package.json
│
└── package.json                # Root package for monorepo (concurrently scripts)
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) Cluster (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/campus-placement-system.git
cd campus-placement-system
```

### 2. Install Dependencies
Install dependencies for the root, client, and server:
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the **`/server`** directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the **`/client`** directory:
```env
# Leave empty to hit relative /api when hosted together, or point to local backend
VITE_API_URL=http://localhost:5000
```

### 4. Seed the Database (Optional but Recommended)
Populate your database with realistic mock data, dummy accounts, and active drives for testing:
```bash
cd server
node src/utils/seed.js
```
*(Default accounts generated: `admin@college.edu`, `student@college.edu`, `recruiter@techcorp.com` — Password: `password123`)*

### 5. Run the Application
From the root directory, start both the frontend and backend concurrently:
```bash
npm start
```
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 🌍 Deployment Guide

### Deploying the Backend (Render)
1. Push your code to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Connect your repository.
4. Set the **Root Directory** to `server`.
5. **Build Command**: `npm install`
6. **Start Command**: `node src/server.js`
7. Under **Environment Variables**, add your `MONGO_URI`, `JWT_SECRET`, etc.
8. Deploy! (Ensure Render's IP is whitelisted in your MongoDB Atlas network settings using `0.0.0.0/0`).

### Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and create a new project.
2. Connect your repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `client`.
5. Under **Environment Variables**, add `VITE_API_URL` pointing to your deployed Render URL (e.g., `https://your-backend.onrender.com`).
6. Deploy! The included `vercel.json` will automatically handle React Router rewrites to prevent 404 errors.
