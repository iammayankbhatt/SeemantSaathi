# SeemantSaathi – Backend API Service

## Project Goal: 
Building a resilient health-tech bridge for rural areas.
Why I built SeemantSaathi
The biggest issue with most healthcare apps is that they assume everyone has 5G and a Gmail account. In rural areas, that’s just not true. I developed the SeemantSaathi Backend specifically to handle "worst-case scenarios"—low bandwidth, flaky internet, and users who only use phone numbers.

The goal wasn't just to make it work, but to make it fail-proof. If our AI service lags, the backend shouldn't just hang and time out; it should provide a fallback.

## Technical Design & Logic
I went with a Node.js/Express setup because it’s lightweight and handles asynchronous requests (like AI processing) really well without eating up server RAM.

### Database Choice:
 I picked PostgreSQL. Why? Because we need to find doctors based on location. Using PostGIS or even simple coordinate queries is much more reliable in Postgres than in a NoSQL setup.

### The Auth Problem: 
I scrapped the usual email/password login. I built a phone-based OTP system using JWT. This is much more intuitive for the target demographic.

### Resiliency: 
I implemented a Circuit Breaker pattern. If the AI service we're hitting gets overloaded, the backend stops sending requests for a bit and returns a "Service Busy" or a cached response instead of crashing the frontend.

## Backend Architecture (How it works)
**The Entry Point**: Everything hits an Express middleware where I handle basic stuff like Rate Limiting (to stop spam) and CORS.

**The Routing**: I split the logic into three main modules:

**symptom.controller.js**: Handles the AI logic and risk assessment.

**doctor.controller.js**: Runs the spatial queries to find nearby help.

**auth.controller.js**: Manages the OTP lifecycle and JWT generation.

**The Exit**: A centralized Error Handler ensures that even if something breaks, the user gets a "friendly" message instead of a scary 500 Internal Server Error stack trace.

## Key API Endpoints I Developed
**POST /check-symptoms**: This is the heavy lifter. It sends data to our ML model and formats the diagnostic result.

**GET /find-doctors**: Takes lat and lng as query params and returns a list of clinics within a specific radius.

**POST /auth/send-otp**: Generates a 6-digit code and stores it with an expiry timestamp.

## Performance Benchmarks (From my tests)
I ran some load tests using Autocannon and Postman to see where the breaking point was:

**Latency**: Average response is around 180ms, which is solid.

**Load**: Handled 100 concurrent connections without the memory usage crossing 150MB.

**Reliability**: 99.8% uptime during my 24-hour stress test.

## What I actually did (Contribution Summary)
I didn't just write the routes; I built the whole environment. I:

Configured the PostgreSQL schema and wrote the SQL migrations.

Built the JWT authentication middleware to protect private routes.

Integrated the AI Service and wrote the logic to handle its timeouts.

Set up Winston for logging, so I can actually see what's happening when a request fails in the middle of the night.