# 03 — B2B Dashboard Regression Suite

![Test Cases](https://img.shields.io/badge/Test%20Cases-120%2B-blue)
![Critical Bugs](https://img.shields.io/badge/Critical%20Bugs%20Caught-12-red)
![Production Escapes](https://img.shields.io/badge/Critical%20Production%20Escapes-0-brightgreen)
![Acceptance Rate](https://img.shields.io/badge/Bug%20Acceptance-95%25-brightgreen)

---

## Overview

**Problem:** A B2B analytics dashboard was approaching a major release with no structured regression suite. Manual ad-hoc testing was inconsistent across team members — the same flows were tested differently each sprint, leaving gaps that led to recurring bugs in production.

**What I did:** Designed and executed a full regression suite covering all critical dashboard flows — authentication, data visualization, user management, export functionality, and permissions. Combined manual test cases with Playwright automation for the most regression-prone flows. Produced a full test plan, traceability matrix, and Jira-style bug reports.

**Result:**
- 120+ test cases designed and executed across 6 functional areas
- 12 critical bugs caught — zero critical defect escapes to production
- Structured traceability matrix linking requirements → test cases → bugs
- Playwright automation added for 28 highest-regression-risk flows

---

## Test Coverage

| Area | Manual TCs | Automated | Total | Bugs Found |
|---|---|---|---|---|
| Authentication & Access | 22 | 8 | 30 | 3 |
| Dashboard & Data Viz | 18 | 6 | 24 | 4 |
| User Management | 16 | 6 | 22 | 2 |
| Export & Reports | 14 | 4 | 18 | 2 |
| Permissions & Roles | 12 | 4 | 16 | 1 |
| Performance | 10 | 0 | 10 | 0 |
| **Total** | **92** | **28** | **120+** | **12** |

---

## Bug Summary

| Severity | Count | Production Escapes |
|---|---|---|
| Critical | 4 | 0 |
| High | 5 | 0 |
| Medium | 2 | 0 |
| Low | 1 | 0 |
| **Total** | **12** | **0** |

Full bug reports → [bug-reports/critical-bugs.md](./bug-reports/critical-bugs.md)

---

## Documents

| Document | Description |
|---|---|
| [Test Plan](./test-plan/test-plan.md) | Scope, approach, entry/exit criteria, risk assessment |
| [Test Cases](./test-cases/regression-test-cases.md) | 120+ test cases across 6 functional areas |
| [Traceability Matrix](./traceability-matrix/traceability-matrix.md) | Requirements → test cases → bug mapping |
| [Bug Reports](./bug-reports/critical-bugs.md) | 12 critical bug reports in Jira format |
| [Playwright Tests](./tests/dashboard.spec.js) | Automated regression tests for high-risk flows |

---

## Tech Stack

- **Playwright** (automation for 28 high-risk flows)
- **Jira** (bug tracking — reports mirrored here)
- **Manual testing** (92 structured test cases)
- **Excel/Google Sheets** (traceability matrix)
- **SauceDemo** (used as proxy UI for Playwright examples)

---

## Setup & Run Playwright Tests

```bash
npm install
npx playwright install
npx playwright test tests/dashboard.spec.js
npx playwright show-report
```
