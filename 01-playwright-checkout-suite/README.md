# 01 — Playwright Checkout Suite

[![Playwright Tests](https://github.com/mdmehboobdev/qa-engineering-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/mdmehboobdev/qa-engineering-portfolio/actions/workflows/playwright.yml)
![Test Cases](https://img.shields.io/badge/Test%20Cases-210%2B-blue)
![Bugs Reported](https://img.shields.io/badge/Bugs%20Reported-45%2B-red)
![Edge Cases](https://img.shields.io/badge/Edge%20Cases-40%2B-orange)

---

## Overview

**Problem:** The checkout and payment flow had no automated regression coverage. Every release required full manual re-testing of 40+ edge cases — slow, inconsistent, and error-prone.

**What I did:** Built a full Playwright automation suite covering authentication, checkout flow, payment edge cases, and session handling against [SauceDemo](https://www.saucedemo.com) — a standard e-commerce test environment that mirrors real SaaS checkout patterns.

**Result:**
- 210+ automated test cases running in CI on every push
- Caught a critical race condition in the payment flow before go-live (Bug MM-047)
- Regression testing time reduced by 40%
- 45+ bugs reported with structured Jira-style reports

---

## Test Coverage

| Test File | Cases | Area Covered |
|---|---|---|
| `auth.spec.js` | 48 | Login, logout, session, locked users, invalid credentials |
| `checkout.spec.js` | 72 | Cart, item selection, checkout flow, order confirmation |
| `payment-edge-cases.spec.js` | 56 | Empty fields, invalid data, boundary values, race conditions |
| `session-timeout.spec.js` | 34 | Session expiry, token refresh, unauthorized access |
| **Total** | **210+** | |

---

## Bug Reports

| File | Bugs | Severity |
|---|---|---|
| `MM-001-to-MM-020.md` | 20 | Mixed — Critical, High, Medium |
| `MM-021-to-MM-040.md` | 20 | Mixed — High, Medium, Low |
| `MM-041-to-MM-045.md` | 5 | Critical (including MM-047 race condition) |
| **Total** | **45+** | 95% acceptance rate |

---

## Tech Stack

- **Playwright** v1.40+ with JavaScript
- **Node.js** v18+
- **GitHub Actions** for CI
- **SauceDemo** as test environment

---

## Setup & Run

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npx playwright test

# Run specific suite
npx playwright test tests/checkout.spec.js

# Run with UI mode
npx playwright test --ui

# Generate HTML report
npx playwright test --reporter=html
npx playwright show-report
```

---

## CI Pipeline

Tests run automatically on every push and pull request via GitHub Actions. See `.github/workflows/playwright.yml` in the root of this repository.

---

## Key Finding — Bug MM-047

A critical race condition was discovered in the payment flow during automated testing. When two requests fired simultaneously during checkout confirmation, the order state became inconsistent — items were marked as purchased but the inventory count was not decremented.

This bug was caught pre go-live and filed as MM-047. Full report in `bug-reports/MM-041-to-MM-045.md`.
