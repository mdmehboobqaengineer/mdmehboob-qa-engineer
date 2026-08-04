# Traceability Matrix — B2B Dashboard Regression
**Document ID:** TM-DASH-001
**Version:** 1.1
**Author:** Muhammad Mehboob — QA Engineer
**Date:** January 2024

---

## How to Read This Matrix

Each row maps a **business requirement** to the **test cases** that verify it and any **bugs** found against it.

| Column | Description |
|---|---|
| REQ ID | Requirement identifier |
| Requirement | What the system must do |
| Test Cases | TC IDs that verify this requirement |
| TC Count | Number of test cases |
| Status | Pass / Fail / Partial |
| Bugs Found | Bug IDs raised against this requirement |

---

## Section 1: Authentication & Access

| REQ ID | Requirement | Test Cases | TC Count | Status | Bugs Found |
|---|---|---|---|---|---|
| REQ-AUTH-001 | Users must authenticate with email and password before accessing the dashboard | DASH-TC-001, DASH-TC-002, DASH-TC-003, DASH-TC-004, DASH-TC-005 | 5 | Pass | — |
| REQ-AUTH-002 | Invalid credentials must show a generic error without revealing which field is wrong | DASH-TC-004, DASH-TC-005, DASH-TC-006, DASH-TC-007 | 4 | Pass | — |
| REQ-AUTH-003 | Authenticated sessions must expire after 30 minutes of inactivity | DASH-TC-019 | 1 | **Fail** | DASH-BUG-001 |
| REQ-AUTH-004 | Accounts must be locked after 10 consecutive failed login attempts | DASH-TC-021 | 1 | **Fail** | DASH-BUG-002 |
| REQ-AUTH-005 | Password reset must not reveal whether an email address is registered | DASH-TC-014 | 1 | **Fail** | DASH-BUG-003 |
| REQ-AUTH-006 | Multi-factor authentication must be supported | DASH-TC-015, DASH-TC-016, DASH-TC-017 | 3 | Pass | — |
| REQ-AUTH-007 | Users must be redirected to their originally requested page after login | DASH-TC-012 | 1 | Pass | — |
| REQ-AUTH-008 | All unauthenticated requests to protected routes must redirect to login | DASH-TC-011, DASH-TC-020 | 2 | Pass | — |
| REQ-AUTH-009 | Logout must fully clear the session | DASH-TC-009, DASH-TC-020 | 2 | Pass | — |
| REQ-AUTH-010 | HTTPS must be enforced on all pages | DASH-TC-029 | 1 | Pass | — |

---

## Section 2: Dashboard & Data Visualization

| REQ ID | Requirement | Test Cases | TC Count | Status | Bugs Found |
|---|---|---|---|---|---|
| REQ-DASH-001 | Dashboard must display KPI cards for Revenue, Users, Conversions, and Retention | DASH-TC-031, DASH-TC-032 | 2 | **Fail** | DASH-BUG-004 |
| REQ-DASH-002 | KPI values must correctly reflect the active date range filter | DASH-TC-032, DASH-TC-033, DASH-TC-034, DASH-TC-035 | 4 | **Fail** | DASH-BUG-004 |
| REQ-DASH-003 | Date range filter must support preset ranges (7d, 30d, 90d) and custom ranges | DASH-TC-033, DASH-TC-034, DASH-TC-035 | 3 | Pass | — |
| REQ-DASH-004 | Future dates must not be selectable in the date picker | DASH-TC-036 | 1 | Pass | — |
| REQ-DASH-005 | Invalid date ranges (start after end) must show a validation error | DASH-TC-037 | 1 | **Fail** | DASH-BUG-005 |
| REQ-DASH-006 | Charts must render correctly for line, bar, and pie types | DASH-TC-038, DASH-TC-039, DASH-TC-040 | 3 | Pass | — |
| REQ-DASH-007 | Chart tooltips must display accurate data on hover | DASH-TC-041 | 1 | Pass | — |
| REQ-DASH-008 | Clicking chart segments must navigate to a detail drill-down view | DASH-TC-042 | 1 | **Fail** | DASH-BUG-006 |
| REQ-DASH-009 | Dashboard must load with no JavaScript console errors | DASH-TC-044 | 1 | **Fail** | DASH-BUG-007 |
| REQ-DASH-010 | Dashboard KPI values must match exported report values | DASH-TC-048 | 1 | **Fail** | DASH-BUG-008 |
| REQ-DASH-011 | Dashboard must load within 5 seconds | DASH-TC-050 | 1 | Pass | — |
| REQ-DASH-012 | Charts must re-render within 3 seconds of date filter change | DASH-TC-051 | 1 | Pass | — |
| REQ-DASH-013 | Dashboard must be responsive on tablet (768px) and desktop (1280px) viewports | DASH-TC-052, DASH-TC-053 | 2 | Pass | — |

---

## Section 3: User Management

| REQ ID | Requirement | Test Cases | TC Count | Status | Bugs Found |
|---|---|---|---|---|---|
| REQ-USR-001 | Admin must be able to invite new users by email with a specified role | DASH-TC-055, DASH-TC-056, DASH-TC-057 | 3 | Pass | — |
| REQ-USR-002 | Only Admin role may invite users | DASH-TC-058 | 1 | Pass | — |
| REQ-USR-003 | Admin must be able to change user roles | DASH-TC-059 | 1 | Pass | — |
| REQ-USR-004 | Admin must be able to deactivate and reactivate users | DASH-TC-060, DASH-TC-061, DASH-TC-062 | 3 | Pass | — |
| REQ-USR-005 | Admin must not be able to deactivate their own account | DASH-TC-063 | 1 | **Fail** | DASH-BUG-009 |
| REQ-USR-006 | The system must ensure at least one active admin exists at all times | DASH-TC-110 | 1 | **Fail** | DASH-BUG-009 |
| REQ-USR-007 | User list must support pagination, search, and sorting | DASH-TC-064, DASH-TC-065, DASH-TC-066, DASH-TC-067, DASH-TC-068 | 5 | Pass | — |
| REQ-USR-008 | Admin can resend and cancel pending invitations | DASH-TC-071, DASH-TC-072 | 2 | Pass | — |
| REQ-USR-009 | User count displayed in header must be accurate | DASH-TC-073 | 1 | **Fail** | DASH-BUG-010 |
| REQ-USR-010 | Role changes must take effect on the user's next login | DASH-TC-076 | 1 | Pass | — |

---

## Section 4: Export & Reports

| REQ ID | Requirement | Test Cases | TC Count | Status | Bugs Found |
|---|---|---|---|---|---|
| REQ-EXP-001 | Admin and Manager can export dashboard data as CSV | DASH-TC-077, DASH-TC-088, DASH-TC-089 | 3 | Pass | — |
| REQ-EXP-002 | CSV export must respect the currently active date range filter | DASH-TC-078 | 1 | **Fail** | DASH-BUG-011 |
| REQ-EXP-003 | CSV export must have correct headers and row count | DASH-TC-079, DASH-TC-080 | 2 | Pass | — |
| REQ-EXP-004 | PDF report must generate successfully and reflect the active date range | DASH-TC-081, DASH-TC-082, DASH-TC-083 | 3 | Pass | — |
| REQ-EXP-005 | PDF generation for large date ranges must not time out | DASH-TC-084 | 1 | **Fail** | DASH-BUG-012 |
| REQ-EXP-006 | Scheduled reports must be configurable by Admin only | DASH-TC-085, DASH-TC-086 | 2 | Pass | — |
| REQ-EXP-007 | Viewer role must not see export controls | DASH-TC-088 | 1 | Pass | — |
| REQ-EXP-008 | Exported file name must include the date range | DASH-TC-090 | 1 | Pass | — |
| REQ-EXP-009 | CSV must handle special characters correctly | DASH-TC-093 | 1 | Pass | — |

---

## Section 5: Permissions & Roles

| REQ ID | Requirement | Test Cases | TC Count | Status | Bugs Found |
|---|---|---|---|---|---|
| REQ-PERM-001 | Navigation items must be restricted by role (Admin / Manager / Viewer) | DASH-TC-095, DASH-TC-096, DASH-TC-097 | 3 | Pass | — |
| REQ-PERM-002 | Role-restricted pages must not be accessible via direct URL | DASH-TC-101, DASH-TC-102 | 2 | **Fail** | DASH-BUG-013 |
| REQ-PERM-003 | API endpoints must validate role permissions server-side | DASH-TC-104, DASH-TC-106, DASH-TC-107 | 3 | Pass | — |
| REQ-PERM-004 | Expired tokens must return 401 not 500 | DASH-TC-108 | 1 | Pass | — |
| REQ-PERM-005 | Role changes must apply without application re-deploy | DASH-TC-105 | 1 | Pass | — |
| REQ-PERM-006 | Viewer must not be able to edit KPI targets | DASH-TC-098 | 1 | Pass | — |
| REQ-PERM-007 | Manager must be able to edit KPI targets | DASH-TC-099 | 1 | Pass | — |

---

## Section 6: Performance

| REQ ID | Requirement | Test Cases | TC Count | Status | Bugs Found |
|---|---|---|---|---|---|
| REQ-PERF-001 | Login page must load in under 3 seconds | DASH-TC-111 | 1 | Pass | — |
| REQ-PERF-002 | Dashboard must load in under 5 seconds | DASH-TC-112 | 1 | Pass | — |
| REQ-PERF-003 | KPI cards must render in under 2 seconds | DASH-TC-113 | 1 | Pass | — |
| REQ-PERF-004 | Charts must render in under 3 seconds | DASH-TC-114 | 1 | Pass | — |
| REQ-PERF-005 | Date filter change must re-render in under 3 seconds | DASH-TC-115 | 1 | Pass | — |
| REQ-PERF-006 | CSV export must complete in under 10 seconds for 1-month data | DASH-TC-116 | 1 | Pass | — |
| REQ-PERF-007 | PDF generation must complete in under 30 seconds for 1-month data | DASH-TC-117 | 1 | Pass | — |
| REQ-PERF-008 | User list with 100 users must load in under 3 seconds | DASH-TC-118 | 1 | Pass | — |

---

## Summary

| Section | Requirements | Fully Passed | Failed | Bugs Found |
|---|---|---|---|---|
| Authentication & Access | 10 | 7 | 3 | 3 |
| Dashboard & Data Viz | 13 | 7 | 6 | 4 |
| User Management | 10 | 7 | 3 | 2 |
| Export & Reports | 9 | 6 | 3 | 2 |
| Permissions & Roles | 7 | 5 | 2 | 1 |
| Performance | 8 | 8 | 0 | 0 |
| **Total** | **57** | **40** | **17** | **12** |

**Requirements coverage:** 57 / 57 (100%)
**Requirements passed:** 40 / 57 (70%) pre-fix
**Requirements passed:** 57 / 57 (100%) post-fix
**Critical production bugs escaped:** 0
