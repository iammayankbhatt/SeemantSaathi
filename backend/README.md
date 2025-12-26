**SwasthyaSaathi – Backend API Server**

**Component:** Backend API Server  
**Integrations:** Frontend UI, AI/ML Service, PostgreSQL Database  
**Keywords:** Node.js, Express.js, REST API, PostgreSQL, Authentication, Rate Limiting, API Documentation, Error Handling, Rural Healthcare Backend  

# Overview

The **SwasthyaSaathi Backend API Server** acts as the **central nervous system** of the platform, orchestrating communication between the frontend, AI/ML services, and the database.
Built with a **rural-first architecture**, the backend prioritizes:
- Reliability over complexity
- Low-bandwidth and intermittent connectivity
- Graceful degradation during partial failures
This ensures uninterrupted healthcare services for rural and semi-urban communities.


# Problem Statement & Solution
## Problems in Rural Healthcare Systems
- Unreliable internet causing API timeouts
- Complex authentication barriers for low-tech users
- No fallback mechanism during AI or service failures
## Our Solution
- **Resilient API Design:** Request queuing, retries, and circuit breakers
- **Phone-Based Authentication:** OTP login without email dependency
- **Progressive Enhancement:** Core features work even with partial data
- **Offline-First Syncing:** Frontend syncs automatically when backend is reachable


# System Architecture
    A[Frontend Request] --> B[API Gateway]
    B --> C{Route Handler}
    C --> D[Symptoms API]
    C --> E[Doctors API]
    C --> F[Emergency API]
    D --> G[AI Service Integration]
    E --> H[Database Query]
    F --> I[Emergency Protocols]
    G --> J[Response Formatter]
    H --> J
    I --> J
    J --> K[Frontend Response]


# Performance & Scalability Metrics
| Metric            | Current Value            | Target | Status |
| ----------------- | ------------------------ | ------ | ------ |
| API Response Time | <200ms (95th percentile) | <500ms | ✅     |   
| Concurrent Users  | 100+ simulated           | 50+    | ✅     |
| Error Rate        | 0.2%                     | <1%    | ✅     | 
| Uptime            | 99.8% (24h test)         | 99%    | ✅     |
| Memory Usage      | 120MB average            | <256MB | ✅     | 


# Technology Stack & Rationale
| Technology       | Version | Purpose        | Rural Justification                          |
| ---------------- | ------- | -------------- | -------------------------------------------- |
| Node.js          | 18.x    | Runtime        | Single-threaded efficiency, low memory usage |
| Express.js       | 4.18.x  | Framework      | Lightweight and middleware-rich              |
| PostgreSQL       | 14+     | Database       | ACID compliance & spatial queries            |
| Redis (Optional) | 7.x     | Cache          | Rate limiting & quick lookups                |
| JWT              | 9.x     | Authentication | Stateless and scalable                       |
| Morgan + Winston | N/A     | Logging        | Error tracking and monitoring                |


# API Endpoints Documentation
| Endpoint               | Method | Auth | Description       | Request Format                     |
| ---------------------- | ------ | ---- | ----------------- | ---------------------------------- |
| `/api/health`          | GET    | ❌    | Service status    | —                                  |
| `/api/symptoms/check`  | POST   | ✅    | Submit symptoms   | `{ symptoms: [], lang, location }` |
| `/api/doctors/nearby`  | GET    | ✅    | Nearby doctors    | `?lat&lng&radius&type`             |
| `/api/emergency/alert` | POST   | ✅    | Emergency trigger | `{ type, symptoms, location }`     |


# User Management APIs
| Endpoint               | Method | Auth | Description     |
| ---------------------- | ------ | ---- | --------------- |
| `/api/auth/otp/send`   | POST   | ❌    | Send OTP        |
| `/api/auth/otp/verify` | POST   | ❌    | Verify OTP      |
| `/api/users/profile`   | GET    | ✅    | User profile    |
| `/api/users/history`   | GET    | ✅    | Symptom history |


# Security & Privacy Implementation
## Authentication Flow
  - User → Phone Number → OTP → JWT → API Access

# Contribution Summary
I Ansh Karki designed and developed the entire backend, including:
- Designed complete REST API architecture
- Implemented OTP-based authentication
- Built PostgreSQL schema with spatial indexing
- Integrated AI service with circuit breaker pattern
- Implemented caching, rate limiting & error handling