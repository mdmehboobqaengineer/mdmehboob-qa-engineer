# Critical Bug Reports — B2B Dashboard Regression
**Project:** B2B Analytics Dashboard v2.4
**Tester:** Muhammad Mehboob — QA Engineer
**Total Bugs Reported:** 12
**Critical Bugs:** 4
**Production Escapes:** 0
**Acceptance Rate:** 95%

---

## DASH-BUG-001 | CRITICAL — Session never times out after inactivity

**Severity:** Critical
**Priority:** P1 — Blocker
**Status:** Closed — Fixed (Pre Release)
**Linked TC:** DASH-TC-019

**Summary:** Authenticated sessions do not expire after the configured 30-minute inactivity timeout. A user who closes their browser tab without logging out remains fully authenticated indefinitely — a critical security issue for a multi-tenant B2B platform handling sensitive sales data.

**Steps to Reproduce:**
1. Login with any valid credentials
2. Do not interact with the application for 60+ minutes
3. Return to the tab and interact with the dashboard

**Expected Result:** Redirected to login with message "Your session has expired. Please log in again."
**Actual Result:** User remains fully authenticated; dashboard accessible with no session expiry.

**Root Cause:** The session inactivity timer was implemented in the frontend only and relied on a `setInterval` that was cleared when the tab became inactive (Page Visibility API background state). The backend had no token expiry validation on the JWT beyond the issued-at date.

**Fix Applied:**
- JWT now includes absolute expiry (8 hours) and inactivity expiry (30 minutes) claims
- Backend validates inactivity claim on every authenticated request
- Frontend refreshes inactivity clock on user interaction; redirects on timeout

**Fix Verified:** Session correctly expires after 30 minutes of inactivity. Confirmed in regression re-test.

**Business Impact (pre-fix):** An unattended workstation or shared computer could allow unauthorized access to sensitive client sales data for an indefinite period.

---

## DASH-BUG-002 | CRITICAL — Account lockout not triggered after repeated failed logins

**Severity:** Critical
**Priority:** P1 — Blocker
**Status:** Closed — Fixed (Pre Release)
**Linked TC:** DASH-TC-021

**Summary:** The login endpoint has no brute-force protection. Entering an incorrect password 50+ times returns the same "Invalid credentials" error with no account lockout, CAPTCHA, or rate limiting. A brute-force attack against a known email address would face no obstacles.

**Steps to Reproduce:**
1. Obtain a valid user email address
2. Submit 50 incorrect password attempts in rapid succession via the login form
3. Observe responses

**Expected Result:** After 10 failed attempts: account temporarily locked for 15 minutes; "Account locked" message shown; admin alerted.
**Actual Result:** All 50 attempts return "Invalid email or password." with no lockout.

**Fix Applied:**
- Failed attempt counter added per email address
- After 10 failures: account locked for 15 minutes
- After 3 lockouts: admin notified via email alert
- CAPTCHA shown after 5 failed attempts

**Fix Verified:** Account locks after 10 failed attempts. Unlocks after 15 minutes. Confirmed.

---

## DASH-BUG-003 | HIGH — Password reset reveals account existence via different responses

**Severity:** High
**Priority:** High
**Status:** Closed — Fixed (Pre Release)
**Linked TC:** DASH-TC-014

**Summary:** The "Forgot Password" form returns different responses for registered vs unregistered email addresses — allowing an attacker to enumerate which email addresses have accounts in the system.

**Registered email response:** "If this email is registered, you will receive a reset link shortly."
**Unregistered email response:** "No account found with this email address."

**Steps to Reproduce:**
1. Navigate to Forgot Password
2. Enter a known registered email → observe response
3. Enter an unknown email → observe response

**Expected Result:** Identical response regardless of whether the email exists.
**Actual Result:** Different responses reveal account existence.

**Fix Applied:** Uniform response for all email addresses: "If this email is registered, you will receive a reset link shortly."

---

## DASH-BUG-004 | CRITICAL — Revenue KPI card shows incorrect total for filtered date ranges

**Severity:** Critical
**Priority:** P0 — Blocker
**Status:** Closed — Fixed (Pre Release)
**Linked TC:** DASH-TC-032, DASH-TC-048

**Summary:** The Revenue KPI card displays an incorrect total when a date range filter is applied. The card continues to show the all-time revenue total regardless of the selected date range, while all other KPI cards and charts correctly respond to the filter.

**Steps to Reproduce:**
1. Login as admin
2. Note the "All Time" Revenue KPI value (e.g., $2,450,000)
3. Apply date filter: Last 7 days
4. Observe Revenue KPI card

**Expected Result:** Revenue KPI updates to show revenue for the last 7 days only (e.g., $48,200).
**Actual Result:** Revenue KPI still shows $2,450,000 (all-time total) — not filtered.

**Root Cause:** The Revenue KPI card component was not subscribed to the global date filter state. It used a hardcoded API call to `/api/revenue/total` (no date params) instead of the shared filtered endpoint `/api/revenue?from=&to=`.

**Fix Applied:** Revenue KPI component updated to use shared date filter context. Endpoint call updated to `/api/revenue?from={{startDate}}&to={{endDate}}`.

**Fix Verified:** Revenue KPI correctly updates to filtered values. Values match exported CSV report for same date range.

**Business Impact (pre-fix):** Business users reviewing daily/weekly performance would see inflated all-time totals rather than period-specific data, leading to incorrect performance assessments.

---

## DASH-BUG-005 | HIGH — Invalid date range (start after end) accepted without error

**Severity:** High
**Priority:** High
**Status:** Closed — Fixed
**Linked TC:** DASH-TC-037

**Summary:** Setting a start date that is after the end date in the custom date range picker does not produce a validation error. The dashboard attempts to query data for an impossible date range, resulting in an empty state with no explanation to the user.

**Steps to Reproduce:**
1. Click the date range picker
2. Set start date: March 1, 2024
3. Set end date: January 1, 2024 (before start)
4. Click Apply

**Expected Result:** Validation error: "Start date must be before end date."
**Actual Result:** Empty charts with no data — no error message explaining why.

**Fix Applied:** Date picker validates that start ≤ end before allowing Apply. Error shown inline if invalid.

---

## DASH-BUG-006 | HIGH — Chart drill-down navigation broken for regional segments

**Severity:** High
**Priority:** High
**Status:** Closed — Fixed
**Linked TC:** DASH-TC-042

**Summary:** Clicking on a regional bar in the "Sales by Region" chart should navigate to a regional detail view. Instead, clicking on any bar throws a JavaScript error and leaves the user on a broken page state.

**Steps to Reproduce:**
1. Login and view the main dashboard
2. Click on any bar in the "Sales by Region" bar chart

**Expected Result:** Navigation to /dashboard/analytics/region/:regionId with regional breakdown data.
**Actual Result:** JS error: `TypeError: Cannot read properties of undefined (reading 'id')`. Dashboard enters broken state.

**Root Cause:** The chart click handler was referencing `event.data.id` but the updated chart library (v2.4 upgrade) changed the click event payload structure from `event.data.id` to `event.point.id`.

**Fix Applied:** Click handler updated to use `event.point.id` per new chart library API.

---

## DASH-BUG-007 | HIGH — Console errors on dashboard load (4 errors)

**Severity:** High
**Priority:** High
**Status:** Closed — Fixed
**Linked TC:** DASH-TC-044

**Summary:** Opening the browser console on dashboard load reveals 4 JavaScript errors, indicating silent failures in component initialization that may affect functionality in edge cases.

**Errors:**
1. `Warning: Each child in a list should have a unique "key" prop` (KPI card component)
2. `Failed to load resource: api/notifications/unread — 404`
3. `TypeError: Cannot read properties of null (reading 'offsetWidth')` (chart resize handler)
4. `Warning: componentDidUpdate setState called without componentWillUnmount cleanup`

**Business Impact:** While not all errors are user-visible, they indicate code quality issues and mask potential real errors in the console — making debugging harder for the development team.

---

## DASH-BUG-008 | HIGH — Exported CSV values do not match dashboard KPI values

**Severity:** High
**Priority:** High
**Status:** Closed — Fixed
**Linked TC:** DASH-TC-048

**Summary:** When comparing dashboard KPI values with values in the exported CSV for the same date range, there is a consistent discrepancy of approximately 3-5% in the Revenue and Conversion Rate figures.

**Root Cause Investigation:**
- Dashboard KPIs use a rounded/aggregated API endpoint for performance
- CSV export uses the raw transaction-level API with exact calculations
- Rounding methodology differs between the two endpoints

**Fix Applied:** Dashboard KPI endpoint updated to use the same calculation methodology as the export endpoint. Values now match to 2 decimal places.

---

## DASH-BUG-009 | CRITICAL — Admin can deactivate their own account (and last admin account)

**Severity:** Critical
**Priority:** P0 — Blocker
**Status:** Closed — Fixed (Pre Release)
**Linked TCs:** DASH-TC-063, DASH-TC-110

**Summary:** An admin user can deactivate their own account from the user management panel. If they are the only admin, this leaves the system with no active admin account — permanently locking all users out of admin functions with no recovery path.

**Steps to Reproduce:**
1. Login as admin (only admin in the system)
2. Navigate to Users
3. Find own user entry
4. Click Deactivate

**Expected Result:** Either (a) Deactivate button hidden for own account, or (b) Error: "You cannot deactivate your own account."
**Actual Result:** Account deactivated successfully. No warning. Admin is now locked out.

**Fix Applied:**
- Deactivate action hidden for the currently logged-in user's own entry
- Guard added: if deactivating a user would leave 0 active admins → block with error "At least one admin must remain active."

**Fix Verified:** Both scenarios confirmed fixed. Confirmed in pre-release regression.

**Business Impact (pre-fix):** Could have resulted in a total admin lockout requiring direct database intervention to restore access — a catastrophic support scenario for a B2B product.

---

## DASH-BUG-010 | MEDIUM — User count in header shows stale number after deactivation

**Severity:** Medium
**Priority:** Medium
**Status:** Closed — Fixed
**Linked TC:** DASH-TC-073

**Summary:** After deactivating a user, the user count shown in the Users page header (e.g., "24 Users") does not update immediately. It continues to show the previous count until the page is hard-refreshed.

**Root Cause:** The user count was fetched on initial component mount and not re-fetched after mutation operations (invite, deactivate, reactivate).

**Fix Applied:** User count re-fetched after every mutation via a shared React Query invalidation.

---

## DASH-BUG-011 | HIGH — CSV export ignores active date range filter

**Severity:** High
**Priority:** High
**Status:** Closed — Fixed
**Linked TC:** DASH-TC-078

**Summary:** When a date range filter is applied on the dashboard (e.g., Last 7 days), clicking "Export CSV" exports all available data regardless of the current filter. The user expects the export to respect the active filter.

**Steps to Reproduce:**
1. Apply date filter: Last 7 days
2. Click Export → CSV
3. Open downloaded CSV and check date range of data

**Expected Result:** CSV contains only the last 7 days of data.
**Actual Result:** CSV contains all historical data (full dataset).

**Root Cause:** Export API call was not reading the active date filter state and was always calling `/api/export/csv` without date parameters.

**Fix Applied:** Export function now reads current filter state and passes `from` and `to` params to the export API.

---

## DASH-BUG-012 | MEDIUM — PDF generation times out for date ranges over 6 months

**Severity:** Medium
**Priority:** High
**Status:** Closed — Fixed
**Linked TC:** DASH-TC-084

**Summary:** Generating a PDF report for a date range longer than 6 months causes a server timeout (504 Gateway Timeout) after 30 seconds. The user sees an error page with no option to retry.

**Steps to Reproduce:**
1. Set date range to a 12-month period
2. Click Generate PDF Report
3. Wait approximately 30 seconds

**Expected Result:** PDF generates (may take longer) with a loading indicator showing progress; or a "large report" warning is shown before generation.
**Actual Result:** 504 Gateway Timeout error after 30 seconds.

**Fix Applied:**
- PDF generation moved to async background job with progress tracking
- User shown estimated time for large reports
- Notification sent when report is ready
- Report accessible from a downloads page

---

## DASH-BUG-013 | CRITICAL — Viewer role can access /users page directly via URL

**Severity:** Critical
**Priority:** P1 — Blocker
**Status:** Closed — Fixed (Pre Release)
**Linked TC:** DASH-TC-102

**Summary:** A user with the Viewer role should have no access to the User Management section. While the Users link is correctly hidden from the sidebar navigation for viewers, directly navigating to `/dashboard/users` in the browser address bar successfully loads the full user management page — including email addresses and roles of all users in the organization.

**Steps to Reproduce:**
1. Login with Viewer credentials
2. Type `/dashboard/users` directly in the browser address bar
3. Press Enter

**Expected Result:** 403 Forbidden page; user management data not loaded.
**Actual Result:** Full user list page loads with all user data visible.

**Root Cause:** Route protection was implemented only in the sidebar navigation component (hiding links) but not at the route level. No server-side permission check was performed when the `/users` route was directly accessed.

**Fix Applied:**
- Route-level permission guard added to all protected routes
- Server-side permission validation added to the `/api/users` endpoint
- Middleware checks role claim in JWT before serving any user management data

**Fix Verified:** Viewer attempting `/dashboard/users` now receives 403 page. API also returns 403.

**Business Impact (pre-fix):** Any viewer-role user could access the full organizational user directory — including names, email addresses, and roles of all employees — a significant data privacy violation in a B2B context.
