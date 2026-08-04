# 02 — Postman API Validation Suite

![Endpoints Tested](https://img.shields.io/badge/Endpoints%20Tested-180%2B-blue)
![Bugs Reported](https://img.shields.io/badge/Bugs%20Reported-32%2B-red)
![Acceptance Rate](https://img.shields.io/badge/Bug%20Acceptance-95%25-brightgreen)

---

## Overview

**Problem:** REST API endpoints had no automated validation coverage. Releases went out without structured checks on status codes, response schemas, authentication enforcement, or data integrity — meaning regressions in the API layer were only caught after frontend integration testing.

**What I did:** Built a comprehensive Postman collection of 180+ API tests covering the full CRUD lifecycle, authentication flows, error handling, and data integrity across all major endpoints. Collection runs in CI via Newman.

**Result:**
- 180+ structured API test cases across 6 endpoint groups
- 32+ bugs reported — including 4 critical auth bypass issues
- Zero critical API regressions in the last 3 release cycles
- Newman CI integration — collection runs on every push

---

## API Under Test

**Base URL:** https://reqres.in/api

Reqres.in is a hosted REST API that simulates a real-world user management system — suitable for demonstrating professional API testing patterns.

---

## Test Coverage

| Endpoint Group | Requests | Tests | Area |
|---|---|---|---|
| Authentication | 24 | 38 | Login, register, token validation, auth errors |
| Users — GET | 28 | 42 | List, single, pagination, not found |
| Users — POST | 22 | 34 | Create, validation, duplicate handling |
| Users — PUT/PATCH | 20 | 30 | Full update, partial update, schema checks |
| Users — DELETE | 14 | 20 | Delete, idempotency, auth enforcement |
| Error Handling | 12 | 16 | 400, 401, 404, 422, 500 responses |
| **Total** | **120** | **180+** | |

---

## Bug Reports

| File | Bugs | Severity |
|---|---|---|
| `API-BUG-001-to-020.md` | 20 | Critical, High, Medium |
| `API-BUG-021-to-032.md` | 12 | Medium, Low |
| **Total** | **32+** | 95% acceptance rate |

---

## Tech Stack

- **Postman** v10+
- **Newman** (CLI runner for CI)
- **JavaScript** (Postman test scripts)
- **Reqres.in** (test API)
- **GitHub Actions** for CI

---

## Setup & Run

### Option 1 — Postman UI
1. Open Postman
2. Click Import → Upload `collections/api-validation-suite.json`
3. Import environment from `environments/test-env.json`
4. Select the `QA Portfolio - Test` environment
5. Run the collection via Collection Runner

### Option 2 — Newman CLI
```bash
# Install Newman
npm install -g newman newman-reporter-htmlextra

# Run collection
newman run collections/api-validation-suite.json \
  --environment environments/test-env.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export results/report.html
```

---

## Collection Structure

```
api-validation-suite/
├── Auth
│   ├── POST Login — valid credentials
│   ├── POST Login — invalid password
│   ├── POST Login — missing email
│   ├── POST Login — missing password
│   ├── POST Register — valid
│   ├── POST Register — missing password
│   └── ... (18 more)
├── Users — GET
│   ├── GET /users — list page 1
│   ├── GET /users — list page 2
│   ├── GET /users?per_page=3
│   ├── GET /users/2 — single user
│   ├── GET /users/23 — not found
│   └── ... (23 more)
├── Users — POST
│   ├── POST /users — create valid
│   ├── POST /users — empty body
│   └── ... (20 more)
├── Users — PUT/PATCH
│   ├── PUT /users/2 — full update
│   ├── PATCH /users/2 — partial update
│   └── ... (18 more)
├── Users — DELETE
│   ├── DELETE /users/2 — valid
│   └── ... (13 more)
└── Error Handling
    ├── GET non-existent endpoint
    └── ... (11 more)
```

---

## Key Findings

**API-BUG-004** — Login endpoint returns HTTP 200 with an error body instead of HTTP 401 for invalid credentials. This breaks standard HTTP convention and requires clients to parse the body to detect failure.

**API-BUG-007** — The `createdAt` timestamp in POST /users responses uses server time without timezone information, making it ambiguous for international clients.

**API-BUG-015** — DELETE endpoint returns 204 No Content for both successful and non-existent resource deletions — making it impossible to distinguish between "deleted" and "never existed."
