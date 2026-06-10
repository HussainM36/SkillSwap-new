# SkillSwap – Skill Exchange Platform

## Overview

SkillSwap is a full-stack web application that connects people who want to learn new skills with individuals who can teach them. Users can create profiles, showcase their skills, discover other users, send match requests, and communicate through real-time chat.

## Features

* User Registration and Login Authentication
* Profile Creation and Management
* Skill and Category Based Matching
* Match Request System
* Real-Time Chat Functionality
* User Dashboard
* Search and Discover Users
* Profile Photo Upload Support
* Responsive User Interface

## Tech Stack

### Frontend

* React.js
* Vite
* Axios
* React Router
* CSS

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT Authentication
* Multer

### Database

* MongoDB
* Mongoose

## Project Structure

SkillSwap/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
├── src/
│ ├── pages/
│ ├── context/
│ └── components/
│
├── public/
└── README.md

## Installation

### Clone Repository

git clone https://github.com/Ananyanaik24/SkillSwap-new.git

### Install Backend Dependencies

cd backend

npm install

### Install Frontend Dependencies

cd ..

npm install

### Configure Environment Variables

Create a .env file inside the backend folder:

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

PORT=5003

### Run Backend

cd backend

npm start

### Run Frontend

npm run dev

## Future Enhancements

* AI-Based Skill Recommendations
* Video Calling Between Matched Users
* Skill Rating and Review System
* Notifications System
* Learning Progress Tracking
* Mobile Application Support

## Author

Ananya Naik

## License

This project is developed for educational and learning purposes.
