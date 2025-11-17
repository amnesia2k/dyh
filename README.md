# DYH Community Platform: A Full-Stack Monorepo

Welcome to the **DYH Community Platform**, a robust full-stack monorepo designed to streamline community management with a focus on Head of Tribe (HoT) administration, member engagement, and content distribution. This project demonstrates modern web development practices, leveraging a powerful backend API and a dynamic frontend client, all orchestrated within a unified development environment.

Developed as a monorepo, it elegantly manages a feature-rich backend API built with Node.js, Express, and Mongoose, alongside a highly interactive frontend client powered by TypeScript, React, TanStack Start, and Tailwind CSS. The entire stack is containerized with Docker Compose, providing a consistent and isolated development experience.

## ✨ Features

This platform is packed with functionalities to support comprehensive community operations:

-   **Head of Tribe (HoT) Management**: Full CRUD operations for HoT profiles, including authentication (registration, login, logout) and administrative capabilities.
-   **Member Directory**: Comprehensive management of community members, including profiles, contact information, and departmental interests.
-   **Sermon & Media Library**: Organize and distribute sermons with details like title, speaker, date, and Spotify embeds.
-   **Event Scheduling**: Create, manage, and display community events with rich descriptions and location details.
-   **Announcements Board**: Publish and update important announcements for the community.
-   **Prayer Request System**: Facilitate anonymous or identified prayer requests with status tracking (new, read, resolved).
-   **Testimony Submission**: Allow members to submit testimonies, with administrative features for approval and featuring.
-   **Centralized Activity Log**: A real-time activity feed tracks significant system events, providing transparency and oversight.
-   **Secure Image Uploads**: Seamless integration with Cloudinary for handling all image uploads, returning secure URLs for storage.
-   **Robust Authentication**: JWT-based authentication ensures secure access to protected routes for HoTs and administrators.
-   **Comprehensive API Documentation**: Auto-generated Swagger UI provides an interactive and up-to-date reference for all API endpoints.
-   **Frontend Excellence**: Built with TypeScript, React, and TanStack Start for optimal performance, type safety, and server-side rendering (SSR) capabilities.
-   **Styling with Purpose**: Tailwind CSS for rapid, utility-first styling, ensuring a responsive and modern user interface.
-   **Error Monitoring**: Integrated Sentry for real-time error tracking and performance monitoring across both client and server.
-   **Containerized Development**: Docker and Docker Compose simplify setup and deployment, ensuring environmental consistency.

## 🛠️ Technologies Used

| Category         | Technology                 | Description                                    |
| :--------------- | :------------------------- | :--------------------------------------------- |
| **Backend**      | Node.js                    | JavaScript runtime environment                 |
|                  | Express.js                 | Web framework for Node.js                      |
|                  | Mongoose                   | MongoDB object modeling for Node.js            |
|                  | MongoDB                    | NoSQL database                                 |
|                  | Redis                      | In-memory data store for caching & queues      |
|                  | BullMQ                     | Job queue for Node.js (activity logging)       |
|                  | JWT                        | Token-based authentication                     |
|                  | bcryptjs                   | Password hashing                               |
|                  | Zod                        | TypeScript-first schema validation             |
|                  | Multer                     | Middleware for handling `multipart/form-data`  |
|                  | Cloudinary                 | Cloud-based image and video management         |
|                  | Swagger-jsdoc              | OpenAPI specification generator                |
|                  | Swagger UI Express         | Middleware for serving Swagger UI              |
| **Frontend**     | TypeScript                 | Strongly typed JavaScript                      |
|                  | React                      | JavaScript library for building UIs            |
|                  | TanStack Start             | Full-stack framework built on TanStack Router  |
|                  | TanStack Router            | Next-gen routing for React and Solid           |
|                  | TanStack Query             | Data-fetching & state management               |
|                  | Vite                       | Next-generation frontend tooling               |
|                  | Tailwind CSS               | Utility-first CSS framework                    |
| **DevOps & Tools**| Docker                     | Containerization platform                      |
|                  | Docker Compose             | Define and run multi-container Docker applications |
|                  | Bun                        | Fast all-in-one JavaScript runtime, bundler, and package manager |
|                  | ESLint                     | Pluggable JavaScript linter                    |
|                  | Prettier                   | Opinionated code formatter                     |
|                  | Husky                      | Git hooks for pre-commit linting & formatting  |
|                  | Sentry                     | Error tracking and performance monitoring      |
|                  | Netlify                    | Hosting and serverless functions (for client)  |

## 🚀 Getting Started

Follow these steps to set up the DYH Community Platform locally. The project uses Docker Compose for an easy, containerized setup including the database, cache, backend API, and frontend client.

### Prerequisites
Before you begin, ensure you have the following installed on your system:
-   `Git`: For cloning the repository.
-   `Docker` & `Docker Compose`: For containerizing the application.
-   `Bun`: The project uses Bun as its package manager and runtime in the Docker images.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/amnesia2k/dyh.git
    cd dyh
    ```

2.  **Configure Environment Variables**:
    *   **Server**: Navigate to the `server` directory. Create a `.env` file based on `server/.env.example`.
        ```bash
        cp server/.env.example server/.env
        ```
        Edit `server/.env` with your specific settings, especially for Cloudinary.
    *   **Client**: Navigate to the `client` directory. Create a `.env.local` file based on `client/.env.local`.
        ```bash
        cp client/.env.local client/.env
        ```
        Edit `client/.env` with your Sentry DSN if you plan to use Sentry locally.

3.  **Build and Run with Docker Compose**:
    From the root of the repository, run:
    ```bash
    docker-compose up --build -d
    ```
    This command will:
    -   Build Docker images for both the `client` and `server`.
    -   Start a MongoDB instance (`db`) for data persistence.
    -   Start a Redis instance (`redis`) for caching and the activity queue.
    -   Start the backend API (`api`) on `http://localhost:8000`.
    -   Start the frontend client (`web`) on `http://localhost:3000`.
    -   Provide administrative GUIs: `Redis Commander` on `http://localhost:8081` and `Mongo Express` on `http://localhost:8082` (with default `admin`/`secret` credentials).

4.  **Verify Services**:
    Check the status of your running containers:
    ```bash
    docker-compose ps
    ```
    All services (`db`, `redis`, `api`, `web`, `redis-commander`, `mongo-express`) should be in an `Up` state.

## 🚀 Usage

Once the Docker Compose services are up and running, you can access the various parts of the platform:

1.  **Access the Frontend**:
    Open your web browser and navigate to:
    `http://localhost:3000`
    You will see the TanStack Start client application.

2.  **Explore the API Documentation (Swagger UI)**:
    For a comprehensive and interactive view of all backend API endpoints, including request/response schemas and examples, visit:
    `http://localhost:8000/api-docs`
    This interface allows you to test endpoints directly.

3.  **Backend Health Check**:
    You can perform a simple health check for the backend API by visiting:
    `http://localhost:8000/api/v1`
    It should return a `{"message": "Hello World!"}` response.

## 🌟 DYH Backend API

## Overview
The DYH Backend API is a robust Node.js application built with Express.js, designed to power the DYH Community Platform. It utilizes Mongoose for MongoDB object data modeling, integrates Redis for caching and activity queuing, and employs Cloudinary for image asset management. Schema validation is handled by Zod, ensuring data integrity across all operations.

## Features
-   **Authentication & Authorization**: Secure JWT-based authentication for Head of Tribes (HoTs) and role-based access control.
-   **User Management**: Comprehensive CRUD operations for HoT profiles and community members.
-   **Content Management**: Endpoints for managing sermons, events, and announcements.
-   **Engagement Tools**: Functionality for prayer requests and testimony submissions with status tracking.
-   **Activity Logging**: Asynchronous logging of key system activities via an in-process event bus.
-   **Image Uploads**: Dedicated endpoint for uploading images to Cloudinary, returning secure URLs.
-   **API Documentation**: Auto-generated interactive Swagger UI for all endpoints.

## Getting Started
### Installation
To run the backend API in a containerized environment, ensure Docker and Docker Compose are installed. From the root directory of the monorepo, execute:
```bash
docker-compose up --build -d api db redis
```
This will start the API server, MongoDB, and Redis instances.

Alternatively, to run the server directly (outside Docker Compose):
1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `bun install`
3.  Start the development server: `bun dev`

### Environment Variables
The following environment variables are required for the server to operate correctly. Place them in a `.env` file within the `server/` directory, mirroring `server/.env.example`.

-   `PORT=8000`: Port for the API server to listen on.
-   `DB_URL=mongodb://localhost:27017/dyhdb`: MongoDB connection URL. When running with Docker Compose, set this to `mongodb://db/dyhdb` to connect to the `db` service.
-   `JWT_SECRET_KEY=your_super_secret_jwt_key_here`: Secret key for signing and verifying JSON Web Tokens. **Highly recommended to generate a strong, unique key for production.**
-   `NODE_ENV=development`: Application environment (`development`, `production`, `test`). Affects logging and cron jobs.
-   `FRONTEND_URL=http://localhost:3000`: URL of the frontend client for CORS configuration.
-   `API_URL=http://localhost:8000/api/v1`: Base URL of the API for internal services (e.g., keep-alive cron job).
-   `REDIS_HOST=localhost`: Redis server host. When running with Docker Compose, set this to `redis` to connect to the `redis` service.
-   `REDIS_PORT=6379`: Redis server port.
-   `REDIS_TLS=false`: Set to `true` if Redis uses TLS (e.g., production Redis Cloud instances).
-   `CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name`: Your Cloudinary cloud name.
-   `CLOUDINARY_API_KEY=your_cloudinary_api_key`: Your Cloudinary API key.
-   `CLOUDINARY_API_SECRET=your_cloudinary_api_secret`: Your Cloudinary API secret.
-   `CLOUDINARY_FOLDER=dyh`: Optional folder name in Cloudinary to store uploads. Defaults to `dyh`.

## API Documentation
### Base URL
`http://localhost:8000/api/v1`

### Endpoints

#### GET /api/v1
**Overview**: Simple health check endpoint for the API root.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Hello World!"
}
```
**Errors**:
-   `500 Internal Server Error`: Server error.

---

#### GET /activity
**Overview**: Retrieves a paginated list of recent system activities, ordered by creation date (newest first). Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Activities fetched successfully",
  "success": true,
  "data": [
    {
      "_id": "65e6d6c4e0c8b00012345679",
      "action": "MEMBER",
      "type": "NEW",
      "message": "John Doe just registered",
      "meta": {
        "_id": "65e6d6c4e0c8b00012345678",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "phone": "08012345678",
        "birthday": "1990-01-01T00:00:00.000Z",
        "address": "123 Main St",
        "departmentOfInterest": "media",
        "joinedAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-03-05T10:00:00.000Z",
      "updatedAt": "2024-03-05T10:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `500 Internal Server Error`: Failed to get activities.

---

#### GET /announcement
**Overview**: Retrieves all announcements, with optional full-text search.
**Request**:
-   **Query Parameters**:
    -   `search` (optional, string): Term to search for within announcement titles/bodies.
```
No JSON payload required for GET.
```
**Response**:
```json
{
  "message": "Announcements fetched",
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65e6d6c4e0c8b0001234567a",
      "title": "Community Gathering",
      "date": "2024-03-10T00:00:00.000Z",
      "summary": "Join us for a special gathering.",
      "body": "Detailed information about the event.",
      "imageUrl": "https://res.cloudinary.com/.../gathering.jpg",
      "createdAt": "2024-03-05T10:00:00.000Z",
      "updatedAt": "2024-03-05T10:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `500 Internal Server Error`: Failed to fetch announcements.

---

#### GET /announcement/:id
**Overview**: Retrieves a single announcement by its ID.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Announcement fetched",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567a",
    "title": "Community Gathering",
    "date": "2024-03-10T00:00:00.000Z",
    "summary": "Join us for a special gathering.",
    "body": "Detailed information about the event.",
    "imageUrl": "https://res.cloudinary.com/.../gathering.jpg",
    "createdAt": "2024-03-05T10:00:00.000Z",
    "updatedAt": "2024-03-05T10:00:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: Announcement not found.
-   `500 Internal Server Error`: Failed to fetch announcement.

---

#### POST /announcement
**Overview**: Creates a new announcement. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "title": "string", // required
  "date": "YYYY-MM-DD", // required
  "summary": "string", // optional
  "body": "string", // optional
  "imageUrl": "string" // optional, URL to announcement image
}
```
**Response**:
```json
{
  "message": "Announcement created",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567b",
    "title": "New Event Coming Soon",
    "date": "2024-04-15T00:00:00.000Z",
    "summary": "Summary of the exciting new event.",
    "body": "Full details of the upcoming event and how to participate.",
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v1/new_event.jpg",
    "createdAt": "2024-03-05T10:30:00.000Z",
    "updatedAt": "2024-03-05T10:30:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: "Title and date are required", Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `500 Internal Server Error`: Error creating announcement.

---

#### PATCH /announcement/:id
**Overview**: Updates an existing announcement. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "title": "string", // optional
  "date": "YYYY-MM-DD", // optional
  "summary": "string", // optional
  "body": "string", // optional
  "imageUrl": "string" // optional, URL to announcement image
}
```
**Response**:
```json
{
  "message": "Announcement updated",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567b",
    "title": "Updated Event Details",
    "date": "2024-04-20T00:00:00.000Z",
    "summary": "Updated summary for the exciting new event.",
    "body": "Revised full details of the upcoming event.",
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v1/updated_event.jpg",
    "createdAt": "2024-03-05T10:30:00.000Z",
    "updatedAt": "2024-03-05T11:00:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Announcement not found.
-   `500 Internal Server Error`: Error updating announcement.

---

#### DELETE /announcement/:id
**Overview**: Deletes an announcement by ID. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Announcement deleted",
  "success": true
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Announcement not found.
-   `500 Internal Server Error`: Error deleting announcement.

---

#### GET /event
**Overview**: Retrieves all events, with optional full-text search.
**Request**:
-   **Query Parameters**:
    -   `search` (optional, string): Term to search for within event titles/descriptions.
```
No JSON payload required for GET.
```
**Response**:
```json
{
  "message": "Events fetched",
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65e6d6c4e0c8b0001234567c",
      "title": "Annual Retreat",
      "date": "2024-05-01T00:00:00.000Z",
      "location": "Mountain Lodge",
      "description": "Our annual community retreat.",
      "featured": true,
      "imageUrl": "https://res.cloudinary.com/.../retreat.jpg",
      "createdAt": "2024-03-05T10:00:00.000Z",
      "updatedAt": "2024-03-05T10:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `500 Internal Server Error`: Failed to fetch events.

---

#### GET /event/:id
**Overview**: Retrieves a single event by its ID.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Event fetched",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567c",
    "title": "Annual Retreat",
    "date": "2024-05-01T00:00:00.000Z",
    "location": "Mountain Lodge",
    "description": "Our annual community retreat.",
    "featured": true,
    "imageUrl": "https://res.cloudinary.com/.../retreat.jpg",
    "createdAt": "2024-03-05T10:00:00.000Z",
    "updatedAt": "2024-03-05T10:00:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: Event not found.
-   `500 Internal Server Error`: Failed to fetch event.

---

#### POST /event
**Overview**: Creates a new event. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "title": "string", // required
  "date": "YYYY-MM-DD", // required
  "location": "string", // optional
  "description": "string", // optional
  "featured": "boolean", // optional
  "imageUrl": "string" // optional, URL to event image
}
```
**Response**:
```json
{
  "message": "Event created",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567d",
    "title": "Volunteer Day",
    "date": "2024-06-01T00:00:00.000Z",
    "location": "Community Park",
    "description": "Help us clean up the park!",
    "featured": false,
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v1/volunteer_day.jpg",
    "createdAt": "2024-03-05T10:45:00.000Z",
    "updatedAt": "2024-03-05T10:45:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: "Title and date are required", Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `500 Internal Server Error`: Error creating event.

---

#### PATCH /event/:id
**Overview**: Updates an existing event. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "title": "string", // optional
  "date": "YYYY-MM-DD", // optional
  "location": "string", // optional
  "description": "string", // optional
  "featured": "boolean", // optional
  "imageUrl": "string" // optional, URL to event image
}
```
**Response**:
```json
{
  "message": "Event updated",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567d",
    "title": "Updated Volunteer Day",
    "date": "2024-06-05T00:00:00.000Z",
    "location": "Local Park",
    "description": "New details for park cleanup.",
    "featured": true,
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v1/updated_volunteer.jpg",
    "createdAt": "2024-03-05T10:45:00.000Z",
    "updatedAt": "2024-03-05T11:15:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Event not found.
-   `500 Internal Server Error`: Error updating event.

---

#### DELETE /event/:id
**Overview**: Deletes an event by ID. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Event deleted",
  "success": true
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Event not found.
-   `500 Internal Server Error`: Error deleting event.

---

#### GET /hot/me
**Overview**: Retrieves the profile of the currently authenticated Head of Tribe (HoT).
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Current HOT fetched successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567e",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "tribe": "Finance",
    "bio": "Leading with integrity.",
    "imageUrl": "https://res.cloudinary.com/.../jane.jpg",
    "phone": "09012345678",
    "role": "admin",
    "createdAt": "2024-03-01T09:00:00.000Z",
    "updatedAt": "2024-03-05T12:00:00.000Z"
  }
}
```
**Errors**:
-   `401 Unauthorized`: No user found or invalid token.
-   `500 Internal Server Error`: Server error.

---

#### GET /hot
**Overview**: Retrieves a list of all Head of Tribe (HoT) profiles.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "HOTs fetched successfully",
  "success": true,
  "data": [
    {
      "_id": "65e6d6c4e0c8b0001234567e",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "tribe": "Finance",
      "bio": "Leading with integrity.",
      "imageUrl": "https://res.cloudinary.com/.../jane.jpg",
      "phone": "09012345678",
      "role": "admin",
      "createdAt": "2024-03-01T09:00:00.000Z",
      "updatedAt": "2024-03-05T12:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `500 Internal Server Error`: Server error.

---

#### GET /hot/:id
**Overview**: Retrieves a single Head of Tribe (HoT) profile by ID.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "HOT fetched successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567e",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "tribe": "Finance",
    "bio": "Leading with integrity.",
    "imageUrl": "https://res.cloudinary.com/.../jane.jpg",
    "phone": "09012345678",
    "role": "admin",
    "createdAt": "2024-03-01T09:00:00.000Z",
    "updatedAt": "2024-03-05T12:00:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: HOT not found.
-   `500 Internal Server Error`: Server error.

---

#### POST /hot/register
**Overview**: Registers a new Head of Tribe (HoT) account.
**Request**:
```json
{
  "name": "string", // required
  "email": "string", // required, format: email
  "password": "string", // required, min 8 characters
  "tribe": "string", // required
  "bio": "string", // optional
  "imageUrl": "string", // optional, URL to profile image
  "phone": "string" // optional
}
```
**Response**:
```json
{
  "message": "HOT created successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567f",
    "name": "New HoT",
    "email": "new.hot@example.com",
    "tribe": "Operations",
    "bio": "Dedicated to community growth.",
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v1/new_hot.jpg",
    "phone": "08011223344",
    "role": "user",
    "createdAt": "2024-03-05T11:00:00.000Z",
    "updatedAt": "2024-03-05T11:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
**Errors**:
-   `400 Bad Request`: "Name, email, password and tribe are required", "Email address already in use.", Validation errors.
-   `500 Internal Server Error`: Server error.

---

#### POST /hot/login
**Overview**: Authenticates a Head of Tribe (HoT) user and sets an authentication cookie.
**Request**:
```json
{
  "email": "string", // required, format: email
  "password": "string" // required, min 8 characters
}
```
**Response**:
```json
{
  "message": "Login successful",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567e",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "tribe": "Finance",
    "bio": "Leading with integrity.",
    "imageUrl": "https://res.cloudinary.com/.../jane.jpg",
    "phone": "09012345678",
    "role": "admin",
    "lastLogin": "2024-03-05T12:30:00.000Z",
    "createdAt": "2024-03-01T09:00:00.000Z",
    "updatedAt": "2024-03-05T12:30:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
**Errors**:
-   `400 Bad Request`: "Email and password are required.", Validation errors.
-   `401 Unauthorized`: "Invalid email or password."
-   `500 Internal Server Error`: Server error.

---

#### POST /hot/logout
**Overview**: Logs out the current Head of Tribe (HoT) by clearing the authentication cookie. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `500 Internal Server Error`: Server error.

---

#### PATCH /hot/:id
**Overview**: Updates an existing Head of Tribe (HoT) profile. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "name": "string", // optional
  "email": "string", // optional, format: email
  "password": "string", // optional, min 8 characters (will be hashed)
  "tribe": "string", // optional
  "bio": "string", // optional
  "imageUrl": "string", // optional, URL to profile image
  "phone": "string", // optional
  "role": "string" // optional, e.g., "admin", "user"
}
```
**Response**:
```json
{
  "message": "HOT updated successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b0001234567e",
    "name": "Jane E. Doe",
    "email": "jane.e.doe@example.com",
    "tribe": "Updated Tribe",
    "bio": "New bio content.",
    "imageUrl": "https://res.cloudinary.com/.../updated_jane.jpg",
    "phone": "09099887766",
    "role": "admin",
    "createdAt": "2024-03-01T09:00:00.000Z",
    "updatedAt": "2024-03-05T13:00:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: HOT not found.
-   `500 Internal Server Error`: Server error.

---

#### DELETE /hot/:id
**Overview**: Deletes a Head of Tribe (HoT) profile by ID. Requires administrator privileges.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header), `adminGuard`
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "HOT deleted successfully",
  "success": true
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `403 Forbidden`: User does not have 'admin' role.
-   `404 Not Found`: HOT not found.
-   `500 Internal Server Error`: Server error.

---

#### GET /member
**Overview**: Retrieves a list of all community members. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Members fetched successfully",
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65e6d6c4e0c8b00012345680",
      "fullName": "Alice Smith",
      "email": "alice.smith@example.com",
      "phone": "07011223344",
      "birthday": "1995-07-15T00:00:00.000Z",
      "address": "456 Oak Ave",
      "departmentOfInterest": "music",
      "joinedAt": "2023-11-20T00:00:00.000Z",
      "imageUrl": "https://res.cloudinary.com/.../alice.jpg",
      "createdAt": "2024-03-05T10:00:00.000Z",
      "updatedAt": "2024-03-05T10:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `500 Internal Server Error`: Failed to fetch members.

---

#### GET /member/:id
**Overview**: Retrieves a single community member by ID. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Member fetched successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345680",
    "fullName": "Alice Smith",
    "email": "alice.smith@example.com",
    "phone": "07011223344",
    "birthday": "1995-07-15T00:00:00.000Z",
    "address": "456 Oak Ave",
    "departmentOfInterest": "music",
    "joinedAt": "2023-11-20T00:00:00.000Z",
    "imageUrl": "https://res.cloudinary.com/.../alice.jpg",
    "createdAt": "2024-03-05T10:00:00.000Z",
    "updatedAt": "2024-03-05T10:00:00.000Z"
  }
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Member not found.
-   `500 Internal Server Error`: Failed to fetch member.

---

#### POST /member
**Overview**: Creates a new community member record.
**Request**:
```json
{
  "fullName": "string", // required
  "email": "string", // optional, format: email
  "phone": "string", // optional
  "birthday": "YYYY-MM-DD", // optional
  "address": "string", // optional
  "departmentOfInterest": "string", // optional, defaults to "none"
  "joinedAt": "YYYY-MM-DD", // optional
  "imageUrl": "string" // optional, URL to member image
}
```
**Response**:
```json
{
  "message": "Member created successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345681",
    "fullName": "Bob Johnson",
    "email": "bob.johnson@example.com",
    "phone": "08055667788",
    "birthday": "1988-03-20T00:00:00.000Z",
    "address": "789 Pine St",
    "departmentOfInterest": "hospitality",
    "joinedAt": "2024-03-01T00:00:00.000Z",
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v1/bob.jpg",
    "createdAt": "2024-03-05T11:30:00.000Z",
    "updatedAt": "2024-03-05T11:30:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: "Full name and email are required", "Invalid birthday format.", Validation errors.
-   `500 Internal Server Error`: Failed to create member.

---

#### PATCH /member/:id
**Overview**: Updates an existing community member record.
**Request**:
```json
{
  "fullName": "string", // optional
  "email": "string", // optional, format: email
  "phone": "string", // optional
  "birthday": "YYYY-MM-DD", // optional
  "address": "string", // optional
  "departmentOfInterest": "string", // optional
  "joinedAt": "YYYY-MM-DD", // optional
  "imageUrl": "string" // optional, URL to member image
}
```
**Response**:
```json
{
  "message": "Member updated successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345681",
    "fullName": "Robert Johnson",
    "email": "robert.johnson@example.com",
    "phone": "08055667788",
    "birthday": "1988-03-20T00:00:00.000Z",
    "address": "New address, 789 Pine St",
    "departmentOfInterest": "ushering",
    "joinedAt": "2024-03-01T00:00:00.000Z",
    "imageUrl": "https://res.cloudinary.com/example/image/upload/v1/robert.jpg",
    "createdAt": "2024-03-05T11:30:00.000Z",
    "updatedAt": "2024-03-05T12:45:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Validation errors.
-   `404 Not Found`: Member not found.
-   `500 Internal Server Error`: Failed to update member.

---

#### DELETE /member/:id
**Overview**: Deletes a community member record by ID. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Member deleted successfully",
  "success": true
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Member not found.
-   `500 Internal Server Error`: Failed to delete member.

---

#### POST /prayer-request
**Overview**: Submits a new prayer request. Can be anonymous.
**Request**:
```json
{
  "fullName": "string", // optional, required if anonymous is false
  "email": "string", // optional, format: email, required if anonymous is false
  "message": "string", // required
  "anonymous": "boolean", // optional, defaults to false
  "status": "string" // optional, enum: "new", "read", "resolved", defaults to "new"
}
```
**Response**:
```json
{
  "message": "Prayer Request created successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345682",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "message": "Pray for my family.",
    "anonymous": false,
    "status": "new",
    "createdAt": "2024-03-05T12:00:00.000Z",
    "updatedAt": "2024-03-05T12:00:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: "All fields are required.", "Full name is required", "Email is required", Validation errors.
-   `500 Internal Server Error`: Failed to create Prayer Request.

---

#### GET /prayer-request
**Overview**: Retrieves all prayer requests, ordered by creation date (newest first).
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Prayer requests fetched successfully",
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65e6d6c4e0c8b00012345682",
      "fullName": "Jane Doe",
      "email": "jane.doe@example.com",
      "message": "Pray for my family.",
      "anonymous": false,
      "status": "new",
      "createdAt": "2024-03-05T12:00:00.000Z",
      "updatedAt": "2024-03-05T12:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `500 Internal Server Error`: Failed to get Prayer Requests.

---

#### GET /prayer-request/:id
**Overview**: Retrieves a single prayer request by ID.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Prayer Request fetched successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345682",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "message": "Pray for my family.",
    "anonymous": false,
    "status": "new",
    "createdAt": "2024-03-05T12:00:00.000Z",
    "updatedAt": "2024-03-05T12:00:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: Prayer request not found.
-   `500 Internal Server Error`: Failed to get Prayer Request.

---

#### PATCH /prayer-request/:id
**Overview**: Updates the status or details of a prayer request. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "fullName": "string", // optional
  "email": "string", // optional, format: email
  "message": "string", // optional
  "anonymous": "boolean", // optional
  "status": "string" // optional, enum: "new", "read", "resolved"
}
```
**Response**:
```json
{
  "message": "Prayer Request updated successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345682",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "message": "Pray for my family. (Updated)",
    "anonymous": false,
    "status": "read",
    "createdAt": "2024-03-05T12:00:00.000Z",
    "updatedAt": "2024-03-05T13:30:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Prayer request not found.
-   `500 Internal Server Error`: Failed to update Prayer Request.

---

#### GET /sermon
**Overview**: Retrieves all sermons, with optional full-text search.
**Request**:
-   **Query Parameters**:
    -   `search` (optional, string): Term to search for within sermon titles/descriptions/speakers.
```
No JSON payload required for GET.
```
**Response**:
```json
{
  "message": "Sermons fetched",
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65e6d6c4e0c8b00012345683",
      "title": "Walking by Faith",
      "date": "2024-02-25T00:00:00.000Z",
      "spotifyEmbedUrl": "https://open.spotify.com/embed/episode/...",
      "description": "A sermon on living by faith.",
      "speaker": "Pastor John",
      "createdAt": "2024-03-05T10:00:00.000Z",
      "updatedAt": "2024-03-05T10:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `500 Internal Server Error`: Failed to fetch sermons.

---

#### GET /sermon/:id
**Overview**: Retrieves a single sermon by its ID.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Sermon fetched",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345683",
    "title": "Walking by Faith",
    "date": "2024-02-25T00:00:00.000Z",
    "spotifyEmbedUrl": "https://open.spotify.com/embed/episode/...",
    "description": "A sermon on living by faith.",
    "speaker": "Pastor John",
    "createdAt": "2024-03-05T10:00:00.000Z",
    "updatedAt": "2024-03-05T10:00:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: Sermon not found.
-   `500 Internal Server Error`: Failed to fetch sermon.

---

#### POST /sermon
**Overview**: Creates a new sermon entry. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "title": "string", // required
  "date": "YYYY-MM-DD", // required
  "spotifyEmbedUrl": "string", // optional, URL
  "description": "string", // optional
  "speaker": "string" // optional
}
```
**Response**:
```json
{
  "message": "Sermon created",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345684",
    "title": "Grace Abounds",
    "date": "2024-03-17T00:00:00.000Z",
    "spotifyEmbedUrl": "https://open.spotify.com/embed/episode/another_episode_id",
    "description": "A powerful message on divine grace.",
    "speaker": "Evangelist Mary",
    "createdAt": "2024-03-05T12:15:00.000Z",
    "updatedAt": "2024-03-05T12:15:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: "All fields are required", Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `500 Internal Server Error`: Error creating sermon.

---

#### PATCH /sermon/:id
**Overview**: Updates an existing sermon entry. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "title": "string", // optional
  "date": "YYYY-MM-DD", // optional
  "spotifyEmbedUrl": "string", // optional, URL
  "description": "string", // optional
  "speaker": "string" // optional
}
```
**Response**:
```json
{
  "message": "Sermon updated",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345684",
    "title": "Grace Abounds (Revised)",
    "date": "2024-03-24T00:00:00.000Z",
    "spotifyEmbedUrl": "https://open.spotify.com/embed/episode/revised_episode_id",
    "description": "An updated powerful message on divine grace.",
    "speaker": "Evangelist Mary T.",
    "createdAt": "2024-03-05T12:15:00.000Z",
    "updatedAt": "2024-03-05T13:45:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Sermon not found.
-   `500 Internal Server Error`: Error updating sermon.

---

#### DELETE /sermon/:id
**Overview**: Deletes a sermon entry by ID. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Sermon deleted",
  "success": true
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Sermon not found.
-   `500 Internal Server Error`: Error deleting sermon.

---

#### GET /testimony
**Overview**: Retrieves all testimonies, ordered by creation date (newest first).
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Testimonies fetched successfully",
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65e6d6c4e0c8b00012345685",
      "fullName": "David Lee",
      "email": "david.lee@example.com",
      "message": "God changed my life!",
      "anonymous": false,
      "status": "approved",
      "featured": true,
      "approvedAt": "2024-03-03T10:00:00.000Z",
      "createdAt": "2024-03-01T10:00:00.000Z",
      "updatedAt": "2024-03-03T10:00:00.000Z"
    }
  ]
}
```
**Errors**:
-   `500 Internal Server Error`: Failed to get Testimonies.

---

#### GET /testimony/:id
**Overview**: Retrieves a single testimony by its ID.
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Testimony fetched successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345685",
    "fullName": "David Lee",
    "email": "david.lee@example.com",
    "message": "God changed my life!",
    "anonymous": false,
    "status": "approved",
    "featured": true,
    "approvedAt": "2024-03-03T10:00:00.000Z",
    "createdAt": "2024-03-01T10:00:00.000Z",
    "updatedAt": "2024-03-03T10:00:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: Testimony not found.
-   `500 Internal Server Error`: Failed to get Testimony.

---

#### POST /testimony
**Overview**: Submits a new testimony.
**Request**:
```json
{
  "fullName": "string", // required
  "email": "string", // required, format: email
  "message": "string", // required
  "anonymous": "boolean", // optional
  "status": "string" // optional, enum: "new", "read", "resolved", defaults to "new"
}
```
**Response**:
```json
{
  "message": "Testimony created successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345686",
    "fullName": "Sarah Chen",
    "email": "sarah.chen@example.com",
    "message": "I found peace!",
    "anonymous": false,
    "status": "new",
    "createdAt": "2024-03-05T12:30:00.000Z",
    "updatedAt": "2024-03-05T12:30:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: "All fields are required", Validation errors.
-   `500 Internal Server Error`: Failed to create Testimony.

---

#### PATCH /testimony/:id
**Overview**: Updates a testimony's status, approval, or featured flag. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```json
{
  "status": "string", // optional, enum: "new", "read", "resolved"
  "featured": "boolean", // optional
  "approved": "boolean", // optional
  "approvedAt": "YYYY-MM-DD" // optional, will be set automatically if `approved` is true
}
```
**Response**:
```json
{
  "message": "Testimony updated successfully",
  "success": true,
  "data": {
    "_id": "65e6d6c4e0c8b00012345686",
    "fullName": "Sarah Chen",
    "email": "sarah.chen@example.com",
    "message": "I found peace!",
    "anonymous": false,
    "status": "read",
    "featured": true,
    "approved": true,
    "approvedAt": "2024-03-05T14:00:00.000Z",
    "createdAt": "2024-03-05T12:30:00.000Z",
    "updatedAt": "2024-03-05T14:00:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Validation errors.
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Testimony not found.
-   `500 Internal Server Error`: Failed to update Testimony.

---

#### DELETE /testimony/:id
**Overview**: Deletes a testimony by ID. Requires authentication.
**Security**: `cookieAuth` (JWT token in cookie or `Authorization: Bearer` header)
**Request**:
```
No payload required.
```
**Response**:
```json
{
  "message": "Testimony deleted successfully",
  "success": true
}
```
**Errors**:
-   `401 Unauthorized`: No token or invalid token.
-   `404 Not Found`: Testimony not found.
-   `500 Internal Server Error`: Failed to delete Testimony.

---

#### POST /upload/image
**Overview**: Uploads a single image file to Cloudinary and returns its hosted URL.
**Request**:
-   **Content-Type**: `multipart/form-data`
-   **Body**:
    -   `image` (file): The image file to be uploaded (JPEG, PNG, WEBP, max 5MB).
```bash
# Example cURL command
curl -X POST http://localhost:8000/api/v1/upload/image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/image.jpg"
```
**Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/dyh/unique_public_id.jpg",
    "publicId": "dyh/unique_public_id",
    "width": 1024,
    "height": 768,
    "format": "jpg"
  }
}
```
**Errors**:
-   `400 Bad Request`: "No file provided. Expected field name 'image'.", "Invalid file type. Only JPEG, PNG and WEBP images are allowed." (from Multer middleware)
-   `500 Internal Server Error`: "Failed to upload image", Cloudinary upload errors.

---

## 🤝 Contributing

We welcome contributions to the DYH Community Platform! If you have suggestions, bug reports, or want to contribute code, please follow these guidelines:

-   **Fork the Repository**: Start by forking the project to your GitHub account.
-   **Create a New Branch**: For each feature or bug fix, create a dedicated branch (e.g., `feature/add-event-filters` or `fix/auth-bug`).
-   **Code Style**: Ensure your code adheres to the project's ESLint and Prettier configurations. Run `bun lint:fix` and `bun format` before committing.
-   **Meaningful Commits**: Write clear, concise commit messages that explain the purpose of your changes.
-   **Pull Requests**: Submit pull requests to the `main` branch, detailing your changes and referencing any related issues.
-   **Testing**: If applicable, add or update tests to cover your changes.

## 📝 License

This project is licensed under the MIT License.

## ✍️ Author Info

-   **Amnesia2k**
    -   LinkedIn: [https://linkedin.com/in/amnesia2k](https://linkedin.com/in/amnesia2k)
    -   Twitter: [@amnesia2k](https://twitter.com/amnesia2k)
    -   Portfolio: [https://your-portfolio.com](https://your-portfolio.com) (Placeholder)

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat-square&logo=sentry&logoColor=white)](https://sentry.io/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh/)
[![Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)