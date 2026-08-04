# QA Engineering Portfolio — Muhammad Mehboob

[![Playwright Tests](https://github.com/mdmehboobdev/qa-engineering-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/mdmehboobdev/qa-engineering-portfolio/actions/workflows/playwright.yml)
![Test Cases](https://img.shields.io/badge/Test%20Cases-500%2B-blue)
![Bugs Reported](https://img.shields.io/badge/Bugs%20Reported-100%2B-red)
![Acceptance Rate](https://img.shields.io/badge/Bug%20Acceptance-95%25-brightgreen)
![Regression Saved](https://img.shields.io/badge/Regression%20Time%20Saved-40%25-orange)

---

## About

QA Engineer with 2+ years specializing in SaaS web application testing. This repository contains three real-world QA projects covering Playwright automation, REST API validation, and manual regression testing.

- 500+ test cases designed and executed
- 100+ bugs reported with 95% developer acceptance rate
- 12 critical production-blocking bugs caught before go-live
- Playwright automation reduced regression time by 40%

**Stack:** Playwright · Postman · Jira · Git · Python · JavaScript · REST API · SDLC/STLC · Agile/Scrum

**Contact:**
- Email: mdmehboobqaengineer@gmail.com
- LinkedIn: [linkedin.com/in/muhammad-mehboob-4b7a33420](https://www.linkedin.com/in/muhammad-mehboob-4b7a33420)
- Portfolio: [mdmehboob-qa-engineer.netlify.app](https://mdmehboob-qa-engineer.netlify.app)

---

## Projects

### 01 — Playwright Checkout Suite
> E-commerce checkout flow automated with Playwright. 210+ test cases covering payment edge cases, auth, and session handling. Caught a critical race condition pre go-live. Regression time cut by 40%.

**Stack:** Playwright · JavaScript · Node.js · GitHub Actions

[View Project →](./01-playwright-checkout-suite/)

---

### 02 — Postman API Validation Suite
> 180+ REST API endpoint tests covering auth flows, CRUD operations, status codes, and data integrity. Built against Reqres.in with environment-based configuration for easy team sharing.

**Stack:** Postman · REST API · JSON · Newman

[View Project →](./02-postman-api-validation-suite/)

---

### 03 — B2B Dashboard Regression
> Full regression suite for a B2B analytics dashboard. 120+ manual and automated test cases. 12 critical bugs caught — zero critical defect escape to production. Includes full test plan, traceability matrix, and Jira-style bug reports.

**Stack:** Playwright · JavaScript · Manual Testing · Jira

[View Project →](./03-b2b-dashboard-regression/)

---

## Repository Structure

```
qa-engineering-portfolio/
├── README.md
├── PROFILE.md
├── 01-playwright-checkout-suite/
│   ├── README.md
│   ├── playwright.config.js
│   ├── tests/
│   │   ├── auth.spec.js
│   │   ├── checkout.spec.js
│   │   ├── payment-edge-cases.spec.js
│   │   └── session-timeout.spec.js
│   └── bug-reports/
│       ├── MM-001-to-MM-020.md
│       ├── MM-021-to-MM-040.md
│       └── MM-041-to-MM-045.md
├── 02-postman-api-validation-suite/
│   ├── README.md
│   ├── collections/
│   │   └── api-validation-suite.json
│   ├── environments/
│   │   └── test-env.json
│   └── bug-reports/
│       ├── API-BUG-001-to-020.md
│       └── API-BUG-021-to-032.md
├── 03-b2b-dashboard-regression/
│   ├── README.md
│   ├── test-plan/
│   │   └── test-plan.md
│   ├── test-cases/
│   │   └── regression-test-cases.md
│   ├── traceability-matrix/
│   │   └── traceability-matrix.md
│   ├── bug-reports/
│   │   └── critical-bugs.md
│   └── tests/
│       └── dashboard.spec.js
└── .github/
    └── workflows/
        └── playwright.yml
```

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/mdmehboobdev/qa-engineering-portfolio.git
cd qa-engineering-portfolio

# Run Playwright tests (Project 01)
cd 01-playwright-checkout-suite
npm install
npx playwright install
npx playwright test

# Run Playwright tests (Project 03)
cd ../03-b2b-dashboard-regression
npm install
npx playwright test
```

For Postman tests, import the collection from `02-postman-api-validation-suite/collections/` into Postman and set the environment from `environments/test-env.json`.

---

*Available for remote QA roles and freelance contracts. Open to US, UK, and Australian teams.*
