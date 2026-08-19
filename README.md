# BookNest — Book Review Platform

## Overview
BookNest is a MERN stack web application that allows users to manage a catalog of books and share authentic book reviews. Designed as a platform for readers to discover new books and share their opinions, it demonstrates modern full-stack development patterns, including user authentication, CRUD operations, database management, and responsive frontend design.

The project is currently **under development** and is designed to align with professional development standards.

## Project Status
🚧 **Under Development** - Core architecture is planned and implementation is underway.

## Core Features (Planned)
* **User Authentication**: Secure signup and login with password hashing.
* **JWT Authorization**: Secure JSON Web Token-based access control protecting routes and operations.
* **Book Management**: Full CRUD operations for books, enabling authenticated users to add books, and restricting edits/deletions to the book's creator.
* **Review Management**: Rating and review submission for books, restricting edit and delete access to the review's author.
* **RESTful API**: Structured endpoints for seamless communication between client and server.
* **Responsive Interface**: A responsive and accessible frontend interface built with React.
* **MongoDB Database**: Persistent storage for user, book, and review data using Mongoose schemas.

## Tech Stack
* **Frontend**: React.js, Vite, React Router, Axios, Context API, Vanilla CSS
* **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`, `cors`
* **Database**: MongoDB, Mongoose

## High-Level Architecture
BookNest uses a standard MERN request-response flow:
```
React Frontend (Vite) <---> RESTful API (Express / Node.js) <---> Database (MongoDB via Mongoose)
```

### Planned Folder Structure
```
booknest-book-review-platform/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Controller logic for auth, books, and reviews
│   ├── middleware/      # Authentication & authorization checks
│   ├── models/          # Mongoose database models
│   ├── routes/          # Express route definitions
│   └── server.js        # Server entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Shared and reusable UI components
│       ├── context/     # Auth state context
│       ├── pages/       # Page views (Home, Details, Login, Register, Forms)
│       ├── services/    # API client and requests (Axios configuration)
│       ├── App.jsx      # App routing and layout
│       └── main.jsx     # Vite entry point
└── README.md
```

## Learning & Development Goals
* Secure authentication & resource ownership authorization.
* Robust RESTful API architecture and design.
* State management using React's Context API.
* Responsive web styling using Vanilla CSS.
* Clean and explainable codebase structure suitable for technical reviews.
