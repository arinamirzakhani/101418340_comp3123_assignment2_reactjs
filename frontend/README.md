📘 COMP3123 – Assignment 2
Employee Management System (React + Node + MongoDB + Docker)

Student: Arina Mirzakhani
Student ID: 101418340

🚀 Overview

This project is a full-stack Employee Management System built with:

Backend: Node.js, Express, MongoDB, JWT, Multer

Frontend: ReactJS, Material-UI, Axios

Deployment: Docker Compose (frontend + backend + MongoDB)

The application includes authentication, full CRUD functionality, search, validation, and file uploads.

✨ Key Features
🔐 Authentication

User Signup

User Login

JWT-based Authorization

Protected frontend routes

👤 Employee Management

Add new employee

View employee details

Update employee

Delete employee

Upload employee profile picture

🔍 Search

Search employees by department

Search employees by position

Supports combined filtering

🎨 UI/UX

Built using Material-UI

Responsive, clean, user-friendly interface

🧪 REST API Endpoints
Auth

POST /api/auth/signup

POST /api/auth/login

Employees

GET /api/employees

POST /api/employees

GET /api/employees/:id

PUT /api/employees/:id

DELETE /api/employees/:id

GET /api/employees/search

🐳 Run With Docker
1. Clone the repository
git clone https://github.com/arinamirzakhani/101418340_comp3123_assignment2_reactjs
cd 101418340_comp3123_assignment2_reactjs

2. Start all services
docker-compose up --build

Application URLs

Frontend: http://localhost:3000

Backend: http://localhost:5000/api

▶️ Run Without Docker
Backend
cd backend
npm install
npm start


Create .env:

PORT=5000
MONGO_URI=mongodb://localhost:27017/comp3123_assignment2
JWT_SECRET=yourSecretKey

Frontend
cd frontend
npm install
npm start


Create .env:

REACT_APP_API_URL=http://localhost:5000/api

🧾 Validation

The app validates:

Required input fields

Email format

Password format

Missing fields

Invalid login/signup

Invalid employee fields

Both frontend and backend validations are implemented.

📸 Included Screenshots

The submission PDF contains the following:

MongoDB data

Postman API tests (Signup, Login, CRUD, Search)

Frontend CRUD UI pages

Search functionality

Form validation/error messages

Docker containers running

📦 ZIP Submission Notes

Remove:

node_modules (frontend + backend)

.git folders

Include:

All source code

docker-compose.yml

Dockerfiles

README.md

👤 Author

Arina Mirzakhani
COMP3123 – Full-Stack Development
George Brown College