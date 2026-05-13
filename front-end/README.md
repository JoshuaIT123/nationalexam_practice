# CRPM System - Frontend

Car Repair and Payment Management System frontend built with React + Vite + Tailwind CSS.

## Project Structure

```
front-end/
├── backend/           # Express backend API
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── src/               # React frontend
│   ├── pages/         # Page components (Car, Login, Service, etc.)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json       # Root package.json (frontend + backend deps)
├── vite.config.js
└── index.html
```

## Setup

Install dependencies:
```bash
npm install
```

## Development

Frontend (Vite dev server):
```bash
npm run dev
```

Backend (Express server):
```bash
npm run server
```

## Tech Stack

- **Frontend**: React 19, React Router DOM, Tailwind CSS 4, Vite 8
- **Backend**: Express 5, MongoDB (Mongoose), JWT Auth, bcryptjs
- **HTTP Client**: Axios
