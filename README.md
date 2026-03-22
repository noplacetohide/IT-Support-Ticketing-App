# IT support ticketing app

This project consists of a **client** and a **backend** for managing IT support tickets. Follow the steps below to set up and run the application locally.

---

<h2 align="center">🎥 Demo Video</h2>

<p align="center">
  <a href="https://www.youtube.com/watch?v=XCTPAI9orUc" target="_blank">
    <img src="https://img.youtube.com/vi/XCTPAI9orUc/0.jpg" width="700" alt="Demo Video">
  </a>
</p>

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (Recommended: Use `nvm` to manage Node versions)
- [npm](https://www.npmjs.com/)
- Access to required environment variables

---

## 🚀 Getting Started

### 1. Clone and Navigate

```bash
cd IT-Support-Ticketing-App
```

### 2. Use Correct Node Version

```bash
nvm use
```

### 3. Install Dependencies

#### Client

```bash
cd client
pnpm i
```

#### Backend

```bash
cd ../backend
pnpm i
```

---

## 🔐 Environment Variables

### Client (`client/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (`backend/.env`)

```env
MONGO_URI=
JWT_SECRET=
```

> Make sure to replace placeholder values with actual credentials and secrets.  
> Do **not** commit `.env` files to version control.

---

## 🧪 Running the App

### Start the **Backend** (Port: `3000`)

```bash
cd backend
npm run start
```

### Start the **Client** (Port: `5173`)

```bash
cd client
npm run dev
```

- Client runs on: `http://localhost:5731`
- Backend runs on: `http://localhost:3000`

Make sure both servers are running simultaneously for full functionality.

---

## 🛠 Troubleshooting

- If you encounter version issues, ensure `nvm` is installed and that you're using the correct Node version as specified in `.nvmrc`.
- If the backend can't connect to the database, double-check your `.env` values.

---

## 🎉 Happy Coding!

