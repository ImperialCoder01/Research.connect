# Research Connect — Installation Guide

Follow this guide to install dependencies and run **Research Connect** locally.

---

## 📋 Prerequisites
Ensure you have the following installed on your system:
- **Node.js**: v18.x or higher
- **NPM**: v9.x or higher
- **MongoDB**: A running local MongoDB instance or a MongoDB Atlas URI string

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ResearchConnect
```

### 2. Set Up Environment Variables
Copy the `.env.example` file in the `backend` folder and create a `.env` file:
```bash
cp backend/.env.example backend/.env
```
Ensure that `MONGO_URI`, `JWT_SECRET`, and other credentials are set appropriately.

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Seed the Database
Run the seed script to wipe the local DB, establish default indexes, and populate initial Admin and Researcher accounts:
```bash
npm run seed
```

### 5. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🚀 Running the Platform

### Running Backend (API Server)
From the `backend` directory:
```bash
npm run dev
```
The backend server runs by default on `http://localhost:5000`.

### Running Frontend (Vite Client)
From the `frontend` directory:
```bash
npm run dev
```
The frontend dev server runs by default on `http://localhost:5173`. Open this URL in your web browser.
