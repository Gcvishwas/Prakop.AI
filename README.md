# Prakop.AI – Nepali Disaster Response Chatbot 🌏🚨  
# Site Live At 👉🏻 <a href="https://prakop-ai.vercel.app">प्रकोप.AI</a>

[![License: Apache]((https://img.shields.io/badge/License-Apache_2.0-blue.svg)])
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)](https://mongodb.com)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-purple)](https://clerk.dev)

Prakop.AI is a **Nepali-language disaster response chatbot** designed to assist people during natural disasters such as earthquakes, floods, landslides, and fires. The application uses the **Google Gemini API** to generate intelligent and context-aware responses in Nepali. It is built using a modern **full-stack architecture** with authentication, persistent chat storage, and a responsive UI.

This project is suitable for academic submission, and as a strong **AI + Full-Stack portfolio project**.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [🚀 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
  - [⚙️ Installation](#-installation)
  - [💻 Backend Setup](#-backend-setup)
  - [🔐 Environment Variables](#-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [👤 Author](#-author)

---

## ✨ Features

- 🇳🇵 Nepali language disaster-response chatbot  
- 🤖 AI-powered responses using **Gemini API**  
- 🔐 Secure authentication with **Clerk**  
- 💬 Chat history storage for authenticated users  
- 🌐 Emergency contacts access without login  
- ⚡ Fast data fetching with **TanStack Query**  
- 🎨 Modern, responsive UI with **Tailwind CSS**  
- 🗄️ MongoDB database for persistence  
- 🌐 RESTful API built with Express.js  

---

## 🛠️ Technologies Used

### Frontend
- ⚡ React.js
- 🎨 Tailwind CSS
- 🛣️ React Router
- 🔄 TanStack Query (React Query)
- 🔑 Clerk Authentication

### Backend
- 🟢 Node.js
- 🚀 Express.js
- 🗄️ MongoDB
- 🤖 Google Gemini API

---

### Additional Packages & Tools
- `dotenv` – Environment variable management  
- `mongoose` – MongoDB object modeling  
- `cors` – Cross-origin requests  
- `nodemon` – Development server  

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js ≥ 18  
- npm or pnpm  
- MongoDB (local or cloud)  
- Google Gemini API Key  
- Clerk Account (Publishable & Secret Keys)  

---

### ⚙️ Installation

```bash
git clone https://github.com/Gcvishwas/Prakop.AI.git
cd Prakop.AI
cd frontend
npm install
```
### 💻Backend Setup
cd backend
npm install

### Create .env file in both Frontend and Backedn directories
## Backend .env
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
```
## Frontend .env
```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

### Project Structure
```bash
Prakop.AI/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Public & authenticated layouts
│   │   ├── pages/          # Page-level components
│   │   ├── routes/         # App routing
│   │   ├── services/       # API & query logic
│   │   └── utils/          # Helper functions
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── index.js
│   ├── models/             # MongoDB schemas
│   └── package.json
│
└── README.md
```

### 🤝 Contributing
• Fork or clone repository
• Create your feature branch
```bash
git checkout -b feature/YourFeature
```
• Commit changes
```bash
git commit -m "Add new feature"
```
• Push changes
```bash
git push origin feature/YourFeature
```

### 📜 License

Distributed under the
<a href="https://mit-license.org/">MIT License</a>.
See LICENSE for more information.

### 👤 Author
Vishwas Gharti Chhetri
