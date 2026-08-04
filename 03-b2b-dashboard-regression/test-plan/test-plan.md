# Test Plan — B2B Dashboard Regression Suite

**Document ID:** TP-DASH-001
**Version:** 1.3
**Author:** Muhammad Mehboob — QA Engineer
**Date:** January 2024
**Status:** Approved

---

## 1. Introduction

This test plan defines the scope, approach, resources, and schedule for regression testing of the B2B Analytics Dashboard application prior to the v2.4 major release.

The dashboard is a multi-tenant SaaS product used by enterprise clients to visualize sales data, manage team members, generate reports, and configure role-based access. The v2.4 release introduces a redesigned data visualization layer and a new user permissions model — both areas carry high regression risk.

---

## 2. Objectives

- Verify all existing functionality continues to work correctly after the v2.4 changes
- Identify regression defects introduced by the new data visualization layer
- Validate the new role-based permissions model across all user types
- Ensure export and reporting functionality remains intact
- Achieve zero critical defect escapes to production

---

## 3. Scope

### 3.1 In Scope

| Area | Description |
|---|---|
| Authentication | Login, logout, password reset, session management, MFA |
| Dashboard | KPI cards, charts, date filters, drill-down, data refresh |
| User Management | Invite, edit, deactivate, role assignment |
| Export & Reports | CSV export, PDF report generation, scheduled reports |
| Permissions | Admin, Manager, Viewer role restrictions across all features |
| Performance | Page load times, chart render times, export generation time |

### 3.2 Out of Scope

- Third-party payment integration (tested separately)
- Mobile native app (separate test plan)
- Email delivery infrastructure
- Data warehouse pipeline (tested by data engineering team)

---

## 4. Test Approach

### 4.1 Testing Types

**Manual Testing (92 test cases)**
All functional areas will be covered with manual structured test cases documented in the test case register. Manual testing will focus on:
- Happy path flows for all 6 functional areas
- Negative and boundary value tests
- Role-based access validation
- Cross-browser compatibility (Chrome, Firefox, Safari)

**Automated Testing — Playwright (28 test cases)**
The 28 highest-regression-risk flows will be automated in Playwright and added to the CI pipeline for continuous execution on every code push. Automation scope:
- Authentication flows (8 cases)
- Dashboard data loading and filter behaviour (6 cases)
- User management CRUD (6 cases)
- Export trigger and download validation (4 cases)
- Role-based route access (4 cases)

### 4.2 Test Levels

- **Regression Testing** — primary focus: all existing features
- **Smoke Testing** — 10-case smoke suite run immediately after each build
- **Exploratory Testing** — 2 hours unscripted exploration per build on high-risk areas

### 4.3 Test Environment

| Item | Details |
|---|---|
| Environment | QA Staging — dashboard-staging.internal |
| Browsers | Chrome 120, Firefox 121, Safari 17 |
| OS | Windows 11, macOS Sonoma |
| Test Data | Seeded staging dataset (Jan 2023 — Dec 2023) |
| User Accounts | Admin, Manager, and Viewer accounts provisioned |

---

## 5. Entry Criteria

Before testing begins, the following must be true:

- [ ] QA build deployed to staging environment
- [ ] Staging environment accessible and stable
- [ ] Test accounts provisioned (Admin, Manager, Viewer)
- [ ] Test data seeded and verified
- [ ] Build release notes provided by development team
- [ ] Smoke test suite passes (10/10 cases)

---

## 6. Exit Criteria

Testing is complete when:

- [ ] All 120+ test cases executed
- [ ] Zero open Critical severity bugs
- [ ] Zero open High severity bugs (or written risk acceptance from Product)
- [ ] All Medium bugs triaged and assigned
- [ ] Regression Playwright suite passing at 100% in CI
- [ ] Test summary report delivered to stakeholders

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| New permissions model breaks existing role flows | High | Critical | Full permissions matrix tested across all roles |
| Chart library update causes data display regressions | High | High | 24 dashboard test cases, 6 automated |
| Export feature broken on Firefox | Medium | High | Cross-browser export testing included |
| Staging data not matching production data patterns | Medium | Medium | Data team to verify staging dataset integrity |
| Timeline pressure leading to incomplete testing | Low | High | Scope prioritized — critical paths tested first |

---

## 8. Defect Management

All defects will be logged in Jira under project `DASH` with the following workflow:

```
Open → In Progress → In Review → Closed (Fixed / Won't Fix / By Design)
```

**Severity definitions:**

| Severity | Definition |
|---|---|
| Critical | Feature completely broken; no workaround; blocks release |
| High | Major feature impaired; workaround exists but is significant |
| Medium | Feature partially impaired; workaround available |
| Low | Minor issue; cosmetic; minimal user impact |

**Bug acceptance:** Defects are accepted by developers when the reported behaviour is reproduced in the development environment and confirmed as a genuine defect. Target acceptance rate: ≥ 90%.

---

## 9. Test Deliverables

| Deliverable | Owner | Due |
|---|---|---|
| Test Plan (this document) | Muhammad Mehboob | Sprint start |
| Test Cases | Muhammad Mehboob | Day 2 |
| Traceability Matrix | Muhammad Mehboob | Day 3 |
| Daily Bug Reports | Muhammad Mehboob | Daily |
| Test Summary Report | Muhammad Mehboob | Sprint end |
| Playwright Automation Suite | Muhammad Mehboob | Sprint end |

---

## 10. Sign-off

| Role | Name | Date |
|---|---|---|
| QA Engineer | Muhammad Mehboob | January 2024 |
| QA Lead | [Redacted — NDA] | January 2024 |
| Product Manager | [Redacted — NDA] | January 2024 |
