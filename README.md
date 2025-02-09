# Event Trigger Platform

A modern web application for managing and monitoring scheduled and API-based triggers, built with Go (backend) and React/TypeScript (frontend).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)

## Features

- Create and manage triggers (Scheduled & API-based)
- Real-time event logging
- Cron-based scheduling
- Redis caching
- PostgreSQL storage
- Containerized deployment

## Tech Stack

### Backend

- Go 1.21
- Gin Web Framework
- GORM (PostgreSQL)
- Redis
- Docker

### Frontend

- React 18
- TypeScript
- Vite
- TailwindCSS

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Go 1.21+ (for local development)
- Node.js 18+ (for local development)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/event-trigger-platform.git
   cd event-trigger-platform
   ```
2. Start the services using Docker:
   ```sh
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)

## Project Structure

```
/event-trigger-platform
│── backend/            # Go backend (Gin, GORM, Redis, PostgreSQL)
│── frontend/           # React frontend (Vite, TypeScript, TailwindCSS)
│── docker-compose.yml  # Docker Compose file
│── README.md           # Documentation
```

## API Documentation

### Endpoints

#### Triggers

- `GET /api/v1/triggers` - List all triggers
- `POST /api/v1/triggers` - Create a new trigger
- `DELETE /api/v1/triggers/:id` - Delete a trigger
- `POST /api/v1/triggers/:id/execute` - Execute a trigger
- `GET /api/v1/triggers/:id/logs` - Get trigger logs

#### Events

- `GET /api/v1/events` - List all events
- `POST /api/v1/events` - Create a new event
- `GET /api/v1/events/:id` - Get details of an event

## Development

### Backend Development

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   go mod tidy
   ```
3. Run the backend server:
   ```sh
   go run main.go
   ```

### Frontend Development

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

## Deployment

### Using Docker Compose

To deploy the application using Docker Compose, run:

```sh
docker-compose up --build -d
```

### Environment Variables

Ensure the following environment variables are set:

```
DATABASE_URL=postgres://user:password@db:5432/event_db
REDIS_URL=redis://redis:6379
PORT=8080
```

## License

MIT License. See `LICENSE` for details.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Contact

For any inquiries, contact [deeppoharkar21@gmail.com](mailto:deeppoharkar21@gmail.com).
