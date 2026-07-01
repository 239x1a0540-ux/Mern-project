# 🚗 Vehicle Service Management System

A full-stack MERN application developed to simplify vehicle service operations by providing an online platform for service booking, service tracking, customer management, and administrative control.

---

## 📌 Project Overview

The Vehicle Service Management System helps customers book vehicle services online and allows administrators to manage service requests efficiently. The system reduces manual paperwork, improves service tracking, and provides a centralized platform for managing vehicle maintenance operations.

---

## ✨ Features

### Customer Features
- User Registration & Login
- Book Vehicle Services
- View Service History
- Track Service Status
- Update Profile Information

### Admin Features
- Admin Authentication
- View All Service Requests
- Update Service Status
- Manage Service Records
- Monitor Recent Activities
- Revenue Analytics Dashboard

### System Features
- JWT Authentication
- Password Encryption using Bcrypt
- Role-Based Access Control
- RESTful APIs
- Responsive UI Design
- MongoDB Database Integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap
- CSS

### Backend
- Node.js
- Express.js
- JWT
- Bcrypt.js

### Database
- MongoDB
- Mongoose

---

## 📂 Project Structure

```bash
Mern-project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/239x1a0540-ux/Mern-project.git
cd Mern-project
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_SECRET=your_admin_secret
```

Run Backend:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend/frontend
npm install
npm run dev
```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint |
|----------|-----------|
| POST | /api/register |
| POST | /api/login |
| POST | /api/register-admin |

### Services

| Method | Endpoint |
|----------|-----------|
| POST | /api/services |
| GET | /api/services |
| PUT | /api/services/:id |
| DELETE | /api/services/:id |
| PUT | /api/services/:id/status |

### Dashboard

| Method | Endpoint |
|----------|-----------|
| GET | /api/activity |
| GET | /api/revenue |

---

## 📊 Modules

- Authentication Module
- Customer Module
- Admin Module
- Dashboard Module
- Service Management Module

---

## 🎯 Objectives

- Automate vehicle service booking.
- Maintain service records digitally.
- Provide secure authentication.
- Improve customer experience.
- Monitor service activities and revenue.
- Reduce manual paperwork.

---

## 📈 Future Enhancements

- Online Payment Gateway
- Email Notifications
- SMS Alerts
- Mobile Application
- AI-Based Service Recommendations
- Multi-Branch Service Center Management

---

## 👨‍💻 Developer

**Pavan Reddy**

Vehicle Service Management System  
Built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

---

## 📜 License

This project is developed for educational and academic purposes.