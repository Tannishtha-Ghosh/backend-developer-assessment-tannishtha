# Backend Developer Assessment – Real-Time Collaborative Workspace
---------------------------------------------------------------------------------------------------------------------------------

## 1️⃣ Project Overview

This project implements a **production-grade backend service** for a real-time collaborative workspace, similar to a simplified collaborative coding platform.

### Key Capabilities
- Secure authentication and authorization
- Role-based access control (RBAC)
- Project and workspace management
- Real-time collaboration events
- Asynchronous background job processing
- Cloud-ready, scalable backend architecture

The objective of this assignment is to demonstrate **backend system design, correctness, and scalability**, rather than UI complexity.

---

## 2️⃣ Architecture Overview

The backend follows a **modular, cloud-native architecture** with clear separation of concerns.

### High-Level Architecture Diagram

Client
|
v
API Layer (Next.js App Router – Vercel)
|
├── Authentication & RBAC (JWT)
├── Project & Workspace APIs
├── Job Submission APIs
|
├── PostgreSQL (Neon)
│ └── Prisma ORM
|
├── Redis (Upstash)
│ ├── BullMQ Job Queue
│ └── Pub/Sub
|
└── Pusher
└── Real-time collaboration events

markdown
Copy code

### Architectural Principles
- API-first design
- Stateless backend services
- Clear separation of responsibilities
- Serverless-compatible and horizontally scalable

---

## 3️⃣ Setup & Run Instructions

### Prerequisites
- Node.js ≥ 18
- PostgreSQL (Neon recommended)
- Redis (Upstash recommended)
- Pusher account

### Environment Configuration

Create a `.env` file using `.env.example`:

```env
DATABASE_URL=postgresql://<neon-db-url>
JWT_SECRET=your_jwt_secret
REDIS_URL=rediss://<upstash-redis-url>
PUSHER_APP_ID=xxxx
PUSHER_KEY=xxxx
PUSHER_SECRET=xxxx
PUSHER_CLUSTER=ap2
Run Locally
bash
Copy code
npm install
npm run dev
Backend runs at:

arduino
Copy code
http://localhost:3000
Docker (Optional)
bash
Copy code
docker-compose up --build
4️⃣ Design Decisions & Trade-offs
Role Management
Roles are scoped per project using a ProjectMember join table.
This avoids rigid global roles and supports realistic collaboration patterns.

Real-Time Communication
Pusher is used instead of self-hosted WebSockets to ensure serverless compatibility and avoid socket scaling complexity.

Background Job Processing
BullMQ + Redis is used for async jobs, providing:

Retry logic

Idempotency

Failure handling

Serverless Deployment
Backend APIs are deployed on Vercel.
Since Vercel does not support persistent WebSocket servers, real-time logic is offloaded to managed services.

5️⃣ Scalability Considerations
Stateless APIs enable horizontal scaling

PostgreSQL with proper indexing and relational integrity

Redis for queues, caching, and Pub/Sub

Distributed workers supported via BullMQ

Pusher handles real-time fan-out and concurrency

Future Enhancements
CI/CD pipelines

Centralized logging and metrics

Feature flags

Dedicated worker services

6️⃣ API Documentation
Base URL
arduino
Copy code
https://backend-developer-assessment-tannis.vercel.app
Authentication APIs
bash
Copy code
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
Project APIs
bash
Copy code
POST /api/projects
POST /api/projects/{projectId}/invite
PUT  /api/projects/{projectId}/role
Authorization:

php-template
Copy code
Bearer <token>
Job APIs
bash
Copy code
POST /api/jobs
GET  /api/jobs/{jobId}
Real-Time Collaboration
bash
Copy code
POST /api/realtime/collaboration
Events are broadcast via Pusher channels scoped per project.

7️⃣ Test Instructions
Testing focuses on core backend functionality:

Authentication & authorization

Protected routes

Project creation & role enforcement

Job lifecycle management

bash
Copy code
npm test
The architecture supports easy extension to full unit and integration testing using Jest and Supertest.

8️⃣ Deployment Instructions
Production Deployment
Push code to GitHub

Import repository into Vercel

Configure environment variables:

DATABASE_URL

JWT_SECRET

REDIS_URL

PUSHER_APP_ID

PUSHER_KEY

PUSHER_SECRET

PUSHER_CLUSTER

Deploy

Live Deployment
arduino
Copy code
https://backend-developer-assessment-tannis.vercel.app
Health Check
arduino
Copy code
https://backend-developer-assessment-tannis.vercel.app/api/health
Response:

json
Copy code
{ "status": "ok" }
9️⃣ Submission Links
GitHub Repository:
https://github.com/Tannishtha-Ghosh/backend-developer-assessment-tannishtha

Live Backend API:
https://backend-developer-assessment-tannis.vercel.app

✅ Final Note
This project demonstrates a real-world backend system with secure authentication, role-based access control, asynchronous job processing, real-time collaboration, and cloud deployment.