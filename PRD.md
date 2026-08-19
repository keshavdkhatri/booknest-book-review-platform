# BookNest — Product Requirements Document

## 1. Product Overview
BookNest is a web-based book review platform designed to allow users to catalog books and share authentic reviews. In a digital landscape where finding trusted reading recommendations can be overwhelming, BookNest provides a clean, user-centric space to discover, review, and manage books. It is built as a MERN stack application (MongoDB, Express, React, Node.js) with a secure, JWT-authenticated backend and a highly responsive React frontend.

## 2. Project Goals
The goal of the Minimum Viable Product (MVP) is to establish a secure, fully functional, and easy-to-use platform that includes:
- Secure user signup, login, and token-based session persistence.
- Complete CRUD operations for books, where creation is authenticated and modifications are restricted to the book creator.
- Complete CRUD operations for reviews, allowing users to rate books and write reviews, with modifications restricted to the review author.
- A seamless, responsive frontend experience with robust error handling and API integration.

## 3. Target Users
- **Casual Readers**: Users who want to browse books, read reviews written by others, and find their next read.
- **Active Reviewers**: Authenticated users who want to contribute books to the system, write reviews, and rate books.

## 4. Core Features and Functional Requirements

### Authentication
Authentication verifies *who* the user is, whereas authorization verifies *what* they are allowed to do.
- **User Registration**: New users can register with a unique email, username, and password. Passwords must be hashed before storage.
- **User Login**: Existing users can log in with their credentials. Successful login returns a JSON Web Token (JWT).
- **Password Hashing**: Implement secure password hashing using `bcryptjs` on the backend.
- **JWT-Based Authentication**: Issue JWTs upon login/registration. The client will store the token (e.g., in localStorage) and include it in the `Authorization` header (`Bearer <token>`) for subsequent requests to protected API endpoints.
- **Persistent Authentication State**: Utilize React Context API on the frontend to maintain and distribute the authentication state across the application, restoring it from local storage on app reload.
- **Logout**: Allow users to log out, clearing their stored token and resetting the authentication context state.
- **Protected Functionality**: Unauthenticated visitors can view books and reviews, but must be logged in to add books or write, edit, or delete reviews.

### Book Management
- **View All Books**: Visitors and authenticated users can view a list of all books in the database.
- **View Individual Book Details**: Users can click on a book to view its full details, including its cover, description, metadata, and reviews.
- **Add a Book**: Authenticated users can submit a new book.
- **Edit a Book**: Only the user who added/created the book is authorized to edit its details.
- **Delete a Book**: Only the user who added/created the book is authorized to delete it from the system.
- **Book Fields**:
  - `title` (String, required)
  - `author` (String, required)
  - `description` (String, required)
  - `genre` (String, required)
  - `coverImageUrl` (String, optional/fallback provided)
  - `publicationYear` (Number, required)
  - `owner` (ObjectId referencing User, required for authorization checks)

### Review Management
- **View Reviews for a Book**: All users (visitors and authenticated) can view all reviews listed on a book's detail page.
- **Add a Review**: Authenticated users can write a review and submit a rating for any book.
- **Rating**: An integer rating (e.g., 1 to 5 stars).
- **Review Text**: Text content detailing the user's thoughts.
- **Edit Review**: Users can update only their own reviews.
- **Delete Review**: Users can delete only their own reviews.
- **Relationships**:
  - A Book has many Reviews.
  - A User has many Reviews.
  - A Review belongs to one Book and one User.

## 5. Authorization Rules
To ensure data integrity and prevent unauthorized modifications, the following access rules are established:
- **Anonymous Visitors**:
  - Can read all books and reviews.
  - Cannot add books or write/edit/delete reviews.
- **Authenticated Users (General)**:
  - Can read all books and reviews.
  - Can create new books.
  - Can create reviews for any book.
- **Resource Owners (Specific)**:
  - Can edit or delete a book only if they are the designated `owner` who created the listing.
  - Can edit or delete a review only if they are the designated author (`user`) who wrote that specific review.

No administrative role is implemented for the MVP to keep the architecture clean and simple.

## 6. User Experience and Pages
The frontend interface will be fully responsive and adapt cleanly to mobile, tablet, and desktop screens.

### MVP Pages
1. **Home / Books Page**: Displays a grid or list of all books in the platform. Contains navigation links to Login/Register or Logout/Add Book.
2. **Book Details Page**: Shows the details of a specific book. Lists all reviews for that book. If the user is authenticated, displays a form to submit a new review. If the user is the author of a review, displays "Edit" and "Delete" buttons next to their review.
3. **Login Page**: A clean form for users to enter their credentials and authenticate.
4. **Register Page**: A form for new users to sign up.
5. **Add Book Page**: A form for authenticated users to add a new book to the platform.
6. **Edit Book Page**: A form to edit an existing book's details (accessible only to the book's creator).

### UX Components and States
- **Responsive Navigation**: A clean header with a brand logo and links that collapse into a mobile-friendly menu.
- **Loading States**: Display friendly loading indicators (spinners or skeletons) when fetching books, details, or submitting forms.
- **Error States**: Display helpful error messages (e.g., "Failed to load books. Please try again.") and handle form validation failures gracefully.
- **Empty States**: If no books are found or a book has no reviews, display a friendly message (e.g., "No reviews yet. Be the first to write one!").
- **Success/Error Toast/Notifications**: Provide visual confirmation for actions like successful registration, login, book addition, or review submission.
- **Basic Accessibility**: Use semantic HTML (`<main>`, `<header>`, `<nav>`, `<button>`, etc.), appropriate contrast ratios, and alternative text (`alt`) for book cover images.

## 7. Technical Requirements

### Frontend Stack
- **React**: Component-based UI library.
- **Vite**: Modern and fast frontend build tool.
- **React Router**: Client-side routing.
- **JavaScript (ES6+)**: Used for all components and logic (no TypeScript).
- **Axios**: Promised-based HTTP client for consuming API endpoints.
- **Context API**: Global state management for authentication tokens and user session data.
- **Vanilla CSS**: Styled components using native CSS rules for layout and styling (avoiding Tailwind CSS unless requested).

### Backend Stack
- **Node.js & Express.js**: Server and routing framework.
- **MongoDB & Mongoose**: Document database and Object Data Modeling (ODM) library.
- **jsonwebtoken (JWT)**: For generating and verifying access tokens.
- **bcryptjs**: For password hashing.
- **dotenv**: For loading environment variables.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.

The project structure will remain simple, flat, and beginner-friendly to facilitate clean code reviews.

## 8. High-Level Architecture

### Request-Response Flow
```
[React Frontend] (Sends API request via Axios with JWT header)
       │
       ▼
[Express Route] (Receives request on defined REST endpoint)
       │
       ▼
[Auth Middleware] (Validates JWT; attaches user details to req.user)
       │
       ▼
[Controller] (Executes business logic, performs authorization checks)
       │
       ▼
[Mongoose Model] (Applies schema validation and queries database)
       │
       ▼
[MongoDB Database] (Stores/retrieves data)
```

The response flows in reverse: MongoDB returns the document(s) -> Mongoose formats -> Controller sends JSON payload -> Express route returns response status & body -> Axios receives it -> React state updates to re-render UI.

### Directory Structure
```
booknest-book-review-platform/
├── backend/
│   ├── config/          # DB connection & configuration
│   ├── controllers/     # Route logic (authController, bookController, reviewController)
│   ├── middleware/      # Authentication & authorization checks (authMiddleware)
│   ├── models/          # Mongoose Schemas (User, Book, Review)
│   ├── routes/          # Express route definitions (authRoutes, bookRoutes, reviewRoutes)
│   ├── server.js        # Server entry point
│   └── .env             # Environment variables (local-only, not committed)
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Nav, BookCard, ReviewItem, Spinner, ProtectedRoute
        ├── context/     # AuthContext.jsx
        ├── pages/       # Home, BookDetails, Login, Register, AddBook, EditBook
        ├── services/    # api.js (Axios instances and API requests)
        ├── App.jsx      # React router and app layout
        ├── index.css    # Global stylesheet
        └── main.jsx     # Vite entry point
```

## 9. API Requirements

The backend will expose a clean RESTful API:

### Authentication APIs (`/api/auth`)
- `POST /register`: Registers a new user. Expects `username`, `email`, `password`.
- `POST /login`: Authenticates user. Returns JWT and user details.
- `GET /me`: Returns details of the currently authenticated user (requires valid JWT).

### Book APIs (`/api/books`)
- `GET /`: Retrieves all books.
- `GET /:id`: Retrieves details of a specific book by ID.
- `POST /`: Creates a new book. Requires JWT.
- `PUT /:id`: Updates a book. Requires JWT and checks if `req.user.id === book.owner`.
- `DELETE /:id`: Deletes a book. Requires JWT and checks if `req.user.id === book.owner`.

### Review APIs (`/api/reviews`)
- `GET /book/:bookId`: Retrieves all reviews for a specific book.
- `POST /book/:bookId`: Creates a new review for a book. Requires JWT.
- `PUT /:id`: Updates an existing review. Requires JWT and checks if `req.user.id === review.user`.
- `DELETE /:id`: Deletes a review. Requires JWT and checks if `req.user.id === review.user`.

## 10. Data Requirements

### User Model
- `username`: String (required, unique, trimmed, minLength: 3)
- `email`: String (required, unique, lowercase, matches email regex)
- `password`: String (required, minLength: 6)
- Timestamps (`createdAt`, `updatedAt`)

### Book Model
- `title`: String (required, trimmed)
- `author`: String (required, trimmed)
- `description`: String (required)
- `genre`: String (required)
- `coverImageUrl`: String (optional)
- `publicationYear`: Number (required)
- `owner`: ObjectId referencing `User` (required)
- Timestamps (`createdAt`, `updatedAt`)

### Review Model
- `book`: ObjectId referencing `Book` (required)
- `user`: ObjectId referencing `User` (required)
- `rating`: Number (required, min: 1, max: 5)
- `reviewText`: String (required, minLength: 10)
- Timestamps (`createdAt`, `updatedAt`)

## 11. Security and Validation Requirements
- **Password Protection**: Passwords must be hashed using `bcryptjs` with a salt round of 10 before saving.
- **JWT Secrets**: The JWT signing key must be loaded from `process.env.JWT_SECRET` and must not be hardcoded.
- **Authorization Enforcement**: Every updating/deleting request must verify ownership inside the controllers, returning `403 Forbidden` if ownership is not met.
- **Protected Routes**: Middleware must intercept requests to `/api/books` (POST/PUT/DELETE) and `/api/reviews` (POST/PUT/DELETE) to verify the Bearer token in headers. Return `401 Unauthorized` for missing/invalid tokens.
- **Request Validation**: Sanitize and validate incoming payloads (e.g., verify email formats, ensure ratings are integers between 1 and 5) before interacting with the database.
- **Environment Safety**: Keep `.env` in the `.gitignore` to prevent leaking credentials.

## 12. Non-Goals for the MVP
To focus on a highly polished, working core, the following are out of scope:
- Social features (e.g., following other users, liking reviews).
- Complex recommendations (e.g., collaborative filtering).
- Payment gateways or premium memberships.
- Real-time features (e.g., socket-based chats or live notifications).
- Administrative dashboards or multi-role permissions (e.g., Super Admin, Moderator).
- Containerization (Docker) or microservices.
- Redux/Zustand state management (Context API is sufficient).
- Unnecessary third-party book catalog integrations (Google Books API, etc.).
- Advanced search, filtering, or sorting options (the Home page will display available books; search/filtering are deferred as potential future enhancements).

## 13. MVP Acceptance Criteria
The application is considered complete when:
1. **Auth Working**: A user can sign up, log in, view protected pages, log out, and remain logged in on page refresh (JWT stored).
2. **Security**: Passwords in MongoDB are hashed; JWT signature is verified; unauthorized users cannot perform edit/delete requests via UI or direct API calls.
3. **Book Operations**: Users can create books. Creators can edit/delete their own books. Others cannot see edit/delete controls, and any malicious API bypass returns `403 Forbidden`.
4. **Review Operations**: Users can submit reviews with ratings (1-5). Review authors can edit/delete their reviews.
5. **Integration & Responsiveness**: The frontend interacts cleanly with the backend API via Axios. The layout responds beautifully to mobile and desktop screens.
6. **Error Handling**: Form submissions display clear inline errors. Network failures display fallback UI elements.

## 14. Development Constraints
- **Keep it Simple**: Use simple patterns that are easy to explain in an internship interview.
- **No Placeholders**: Ensure all views present complete user flows with real DB data.
- **No Mock Functionality**: All features listed must be fully backed by the database.
- **Alignment**: Must exactly support the resume claims: MERN Stack, JWT auth/authorization, RESTful APIs, responsive React frontend, MongoDB-backed backend.
