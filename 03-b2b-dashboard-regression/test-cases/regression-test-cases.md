# Regression Test Cases — B2B Dashboard
**Document ID:** TC-DASH-001
**Version:** 1.2
**Author:** Muhammad Mehboob — QA Engineer
**Total Test Cases:** 120
**Last Executed:** January 2024

---

## Area 1: Authentication & Access (30 cases)

| TC ID | Test Case | Steps | Expected Result | Status | Bug ID |
|---|---|---|---|---|---|
| DASH-TC-001 | Valid login with admin credentials | 1. Navigate to login page 2. Enter valid admin email & password 3. Click Sign In | Redirected to dashboard home; admin nav visible | Pass | — |
| DASH-TC-002 | Valid login with manager credentials | 1. Enter manager credentials 2. Click Sign In | Redirected to dashboard; manager nav items visible | Pass | — |
| DASH-TC-003 | Valid login with viewer credentials | 1. Enter viewer credentials 2. Click Sign In | Redirected to dashboard; view-only state; no edit buttons | Pass | — |
| DASH-TC-004 | Invalid password shows error | 1. Enter valid email 2. Enter wrong password 3. Click Sign In | Error: "Invalid email or password." | Pass | — |
| DASH-TC-005 | Invalid email shows error | 1. Enter non-existent email 2. Enter any password | Error: "Invalid email or password." | Pass | — |
| DASH-TC-006 | Empty email shows validation error | 1. Leave email blank 2. Click Sign In | Inline validation: "Email is required" | Pass | — |
| DASH-TC-007 | Empty password shows validation error | 1. Leave password blank 2. Click Sign In | Inline validation: "Password is required" | Pass | — |
| DASH-TC-008 | Both fields empty shows first validation error | 1. Click Sign In without filling fields | "Email is required" shown | Pass | — |
| DASH-TC-009 | Logout clears session | 1. Login 2. Click profile menu → Logout | Redirected to login page; session cleared | Pass | — |
| DASH-TC-010 | Session persists on page refresh | 1. Login 2. Refresh browser | User remains logged in; dashboard state preserved | Pass | — |
| DASH-TC-011 | Direct URL access when logged out redirects to login | 1. Not logged in 2. Navigate to /dashboard/analytics | Redirected to login with redirect param | Pass | — |
| DASH-TC-012 | After login redirects to originally requested URL | 1. Access /dashboard/reports while logged out 2. Login | Redirected to /dashboard/reports | Pass | — |
| DASH-TC-013 | Password reset email sent for valid email | 1. Click "Forgot password" 2. Enter valid email 3. Submit | Success message: "Reset email sent" | Pass | — |
| DASH-TC-014 | Password reset with unknown email shows generic message | 1. Click "Forgot password" 2. Enter unknown email | Same success message (no user enumeration) | Fail | DASH-BUG-003 |
| DASH-TC-015 | MFA prompt shown when MFA enabled | 1. Login with MFA-enabled account | MFA code prompt shown after credentials accepted | Pass | — |
| DASH-TC-016 | Invalid MFA code shows error | 1. Enter wrong 6-digit MFA code | "Invalid code. Please try again." | Pass | — |
| DASH-TC-017 | Expired MFA code shows error | 1. Wait for MFA code to expire 2. Submit expired code | "Code expired. Request a new code." | Pass | — |
| DASH-TC-018 | Remember me extends session duration | 1. Login with "Remember me" checked | Session persists for 30 days | Pass | — |
| DASH-TC-019 | Session timeout after inactivity | 1. Login 2. Leave browser idle for timeout period | Redirected to login with "Session expired" message | Fail | DASH-BUG-001 |
| DASH-TC-020 | Browser back after logout does not restore session | 1. Login 2. Logout 3. Click browser back | Login page shown with error; not re-authenticated | Pass | — |
| DASH-TC-021 | Multiple failed logins trigger lockout | 1. Enter wrong password 10 times | Account temporarily locked; lockout message shown | Fail | DASH-BUG-002 |
| DASH-TC-022 | Viewer cannot access admin settings page | 1. Login as viewer 2. Navigate to /dashboard/settings/admin | 403 Forbidden page or redirect | Pass | — |
| DASH-TC-023 | Manager cannot access admin user management | 1. Login as manager 2. Navigate to /dashboard/users/admin | 403 Forbidden page | Pass | — |
| DASH-TC-024 | Admin can access all pages | 1. Login as admin 2. Navigate to all protected routes | All pages accessible | Pass | — |
| DASH-TC-025 | Password field input is masked | 1. Navigate to login page 2. Type in password field | Input shown as dots | Pass | — |
| DASH-TC-026 | Login page is accessible via keyboard only | 1. Tab to email → fill 2. Tab to password → fill 3. Tab to button → Enter | Login succeeds via keyboard | Pass | — |
| DASH-TC-027 | Login error message is descriptive | 1. Submit invalid credentials | Error message clearly states credentials are invalid | Pass | — |
| DASH-TC-028 | Login form submits on Enter key | 1. Fill credentials 2. Press Enter in password field | Login submitted | Pass | — |
| DASH-TC-029 | HTTPS enforced on login page | 1. Navigate to http:// version of login page | Redirected to https:// | Pass | — |
| DASH-TC-030 | Login page loads within 3 seconds | 1. Navigate to login page 2. Measure load time | Page loads in under 3 seconds | Pass | — |

---

## Area 2: Dashboard & Data Visualization (24 cases)

| TC ID | Test Case | Steps | Expected Result | Status | Bug ID |
|---|---|---|---|---|---|
| DASH-TC-031 | KPI cards display correct values on load | 1. Login as admin 2. View dashboard home | All 4 KPI cards show data matching source dataset | Pass | — |
| DASH-TC-032 | Revenue KPI card shows correct total | 1. Check Revenue card against known test data | Revenue matches seeded data total | Fail | DASH-BUG-004 |
| DASH-TC-033 | Date range filter — Last 7 days | 1. Set date filter to "Last 7 days" | All charts and KPIs update to last 7 days data | Pass | — |
| DASH-TC-034 | Date range filter — Last 30 days | 1. Set date filter to "Last 30 days" | All charts and KPIs update | Pass | — |
| DASH-TC-035 | Date range filter — Custom range | 1. Set custom date range 2024-01-01 to 2024-01-31 | Charts show January 2024 data only | Pass | — |
| DASH-TC-036 | Date range — future date not selectable | 1. Open date picker 2. Attempt to select a future date | Future dates are disabled in date picker | Pass | — |
| DASH-TC-037 | Date range — start date after end date shows error | 1. Set start date to 2024-03-01 2. Set end date to 2024-01-01 | Validation error: "Start date must be before end date" | Fail | DASH-BUG-005 |
| DASH-TC-038 | Line chart renders without errors | 1. Login 2. View revenue trend chart | Chart renders fully; no broken state | Pass | — |
| DASH-TC-039 | Bar chart renders without errors | 1. View sales by region chart | Chart renders fully | Pass | — |
| DASH-TC-040 | Pie chart renders without errors | 1. View product breakdown chart | Chart renders fully | Pass | — |
| DASH-TC-041 | Chart tooltips show correct data on hover | 1. Hover over a data point on line chart | Tooltip shows correct date and value | Pass | — |
| DASH-TC-042 | Drill-down on chart navigates to detail view | 1. Click on a bar in the sales bar chart | Detail view for that segment loads correctly | Fail | DASH-BUG-006 |
| DASH-TC-043 | Dashboard data refreshes without full page reload | 1. Click refresh icon on dashboard | Data updates; page does not fully reload | Pass | — |
| DASH-TC-044 | Dashboard loads with no console errors | 1. Open DevTools console 2. Login and view dashboard | Zero console errors on load | Fail | DASH-BUG-007 |
| DASH-TC-045 | Viewer sees same data as admin (no data isolation by role) | 1. Check KPI values as admin 2. Check as viewer | Same values shown (data access not role-restricted) | Pass | — |
| DASH-TC-046 | Chart renders correctly after date filter change | 1. Change date filter 2. Observe chart re-render | Chart smoothly updates with no broken state | Pass | — |
| DASH-TC-047 | Empty state shown when no data for date range | 1. Set date range to a period with no data | Empty state message shown in chart area | Pass | — |
| DASH-TC-048 | Dashboard KPIs match exported report values | 1. Note KPI values 2. Export report 3. Compare | Exported values match dashboard KPIs | Fail | DASH-BUG-008 |
| DASH-TC-049 | Chart legend is visible and interactive | 1. View line chart 2. Click on legend item to hide series | Series hidden from chart | Pass | — |
| DASH-TC-050 | Dashboard loads within 5 seconds | 1. Login and navigate to dashboard 2. Measure load time | Dashboard fully loaded in under 5 seconds | Pass | — |
| DASH-TC-051 | Charts render within 3 seconds of date filter change | 1. Change date range filter 2. Measure chart render time | Charts re-render in under 3 seconds | Pass | — |
| DASH-TC-052 | Dashboard is responsive on tablet viewport | 1. Set viewport to 768px 2. View dashboard | Charts and KPIs stack correctly; no overflow | Pass | — |
| DASH-TC-053 | Dashboard is usable on 1280px viewport | 1. Set viewport to 1280px | All dashboard content visible without horizontal scroll | Pass | — |
| DASH-TC-054 | Filter state preserved on browser back navigation | 1. Set date filter 2. Navigate to detail view 3. Click back | Date filter still applied on return to dashboard | Pass | — |

---

## Area 3: User Management (22 cases)

| TC ID | Test Case | Steps | Expected Result | Status | Bug ID |
|---|---|---|---|---|---|
| DASH-TC-055 | Admin can invite a new user | 1. Login as admin 2. Go to Users → Invite User 3. Enter email and role 4. Send | Invitation email sent; user appears in Pending state | Pass | — |
| DASH-TC-056 | Invite with duplicate email shows error | 1. Invite a user that already exists | Error: "A user with this email already exists" | Pass | — |
| DASH-TC-057 | Invite with invalid email format shows error | 1. Enter "notanemail" in email field | Validation: "Please enter a valid email address" | Pass | — |
| DASH-TC-058 | Manager cannot invite users | 1. Login as manager 2. Access Invite User flow | Feature hidden or 403 returned | Pass | — |
| DASH-TC-059 | Admin can change user role | 1. Find existing user 2. Change role from Viewer to Manager | Role updated; user's permissions change on next login | Pass | — |
| DASH-TC-060 | Admin can deactivate a user | 1. Find active user 2. Click Deactivate | User status changes to Inactive; user cannot login | Pass | — |
| DASH-TC-061 | Deactivated user cannot log in | 1. Deactivate a user account 2. Try to login as that user | Login blocked: "Your account has been deactivated." | Pass | — |
| DASH-TC-062 | Admin can reactivate a deactivated user | 1. Find inactive user 2. Click Reactivate | User status changes to Active; user can login | Pass | — |
| DASH-TC-063 | Admin cannot deactivate their own account | 1. Login as admin 2. View own profile 3. Attempt deactivation | Deactivate button absent or disabled for own account | Fail | DASH-BUG-009 |
| DASH-TC-064 | User list is paginated at 25 items per page | 1. View user list with 30+ users | Pagination controls visible; 25 users per page | Pass | — |
| DASH-TC-065 | User search filters results correctly | 1. Enter name in search field | Users matching search shown; others hidden | Pass | — |
| DASH-TC-066 | User search is case-insensitive | 1. Search "SMITH" 2. Search "smith" | Same results returned | Pass | — |
| DASH-TC-067 | User list sortable by name | 1. Click Name column header | Users sorted A-Z; second click sorts Z-A | Pass | — |
| DASH-TC-068 | User list sortable by date joined | 1. Click Date Joined column header | Users sorted by join date ascending | Pass | — |
| DASH-TC-069 | User profile shows correct role | 1. View user profile | Role displayed matches role assigned during invite | Pass | — |
| DASH-TC-070 | Bulk deactivation works for selected users | 1. Select 3 users via checkboxes 2. Click Bulk Deactivate | All 3 deactivated; page refreshes with updated list | Pass | — |
| DASH-TC-071 | Pending invite can be resent | 1. Find user with Pending status 2. Click Resend Invite | Invite email resent; expiry timer reset | Pass | — |
| DASH-TC-072 | Pending invite can be cancelled | 1. Find user with Pending status 2. Click Cancel Invite | User removed from list; invite link invalidated | Pass | — |
| DASH-TC-073 | User count shown in header is accurate | 1. View Users page 2. Count displayed matches actual list count | Displayed count matches actual user count | Fail | DASH-BUG-010 |
| DASH-TC-074 | Admin can update their own profile name | 1. Navigate to profile settings 2. Change display name | Name updated across all dashboard UI | Pass | — |
| DASH-TC-075 | Admin can update their email address | 1. Navigate to profile settings 2. Change email | Confirmation sent to new email; email updated on confirm | Pass | — |
| DASH-TC-076 | Role change takes effect on next login only | 1. Change user role 2. User refreshes page | Role change requires re-login to take effect | Pass | — |

---

## Area 4: Export & Reports (18 cases)

| TC ID | Test Case | Steps | Expected Result | Status | Bug ID |
|---|---|---|---|---|---|
| DASH-TC-077 | Admin can export dashboard data as CSV | 1. Click Export → CSV | CSV file downloads with correct headers and data | Pass | — |
| DASH-TC-078 | CSV export respects current date filter | 1. Set date filter to last 7 days 2. Export CSV | CSV contains only last 7 days of data | Fail | DASH-BUG-011 |
| DASH-TC-079 | CSV export has correct column headers | 1. Export CSV 2. Open in spreadsheet | Headers match expected: Date, Revenue, Users, Conversions | Pass | — |
| DASH-TC-080 | CSV export has correct number of rows | 1. Export CSV for January 2. Count rows | 31 rows (one per day) plus header | Pass | — |
| DASH-TC-081 | PDF report generates successfully | 1. Click Export → PDF Report | PDF downloads; contains all KPI sections | Pass | — |
| DASH-TC-082 | PDF report date range shown in header | 1. Set custom date range 2. Generate PDF | PDF header shows correct date range | Pass | — |
| DASH-TC-083 | PDF report values match dashboard KPIs | 1. Note dashboard KPIs 2. Generate PDF | PDF values match dashboard | Pass | — |
| DASH-TC-084 | PDF generation fails gracefully on large date range | 1. Select 2 year date range 2. Generate PDF | Loading indicator shown; PDF generates without timeout error | Fail | DASH-BUG-012 |
| DASH-TC-085 | Scheduled report can be configured by admin | 1. Navigate to Reports → Schedule 2. Set weekly schedule | Report scheduled; appears in schedule list | Pass | — |
| DASH-TC-086 | Scheduled report cannot be configured by viewer | 1. Login as viewer 2. Navigate to Reports → Schedule | Feature hidden or 403 returned | Pass | — |
| DASH-TC-087 | Scheduled report can be deleted | 1. View scheduled report 2. Click Delete | Report removed from schedule list | Pass | — |
| DASH-TC-088 | Export button is not visible to viewer | 1. Login as viewer 2. View dashboard | Export button not visible in UI | Pass | — |
| DASH-TC-089 | Export button is visible to manager | 1. Login as manager 2. View dashboard | Export button visible | Pass | — |
| DASH-TC-090 | Exported file name includes date range | 1. Export CSV with custom date range | File named: dashboard-export-2024-01-01-to-2024-01-31.csv | Pass | — |
| DASH-TC-091 | Multiple simultaneous exports do not interfere | 1. Start CSV export 2. Immediately start PDF export | Both files download correctly | Pass | — |
| DASH-TC-092 | Export with empty date range shows error | 1. Clear date filter 2. Click Export | Error: "Please select a date range before exporting" | Pass | — |
| DASH-TC-093 | CSV export handles special characters correctly | 1. Export data containing apostrophes and commas | CSV properly escaped; opens correctly in Excel | Pass | — |
| DASH-TC-094 | Report generation shows loading state | 1. Click Generate PDF for large dataset | Loading spinner visible during generation | Pass | — |

---

## Area 5: Permissions & Roles (16 cases)

| TC ID | Test Case | Steps | Expected Result | Status | Bug ID |
|---|---|---|---|---|---|
| DASH-TC-095 | Admin sees all navigation items | 1. Login as admin 2. View sidebar | All nav items visible: Dashboard, Users, Settings, Reports | Pass | — |
| DASH-TC-096 | Manager sees limited navigation | 1. Login as manager 2. View sidebar | Users → hidden; Settings → hidden; Dashboard + Reports visible | Pass | — |
| DASH-TC-097 | Viewer sees view-only navigation | 1. Login as viewer 2. View sidebar | Only Dashboard visible; all management items hidden | Pass | — |
| DASH-TC-098 | Viewer cannot edit dashboard KPI targets | 1. Login as viewer 2. Attempt to edit KPI target | Edit controls hidden or disabled | Pass | — |
| DASH-TC-099 | Manager can edit KPI targets | 1. Login as manager 2. Edit a KPI target | Target updated successfully | Pass | — |
| DASH-TC-100 | Admin can edit all KPI targets | 1. Login as admin 2. Edit KPI target | Target updated | Pass | — |
| DASH-TC-101 | Direct URL to admin settings returns 403 for viewer | 1. Login as viewer 2. Navigate directly to /settings/admin | 403 page shown; not redirected to login | Pass | — |
| DASH-TC-102 | Direct URL to user management returns 403 for viewer | 1. Login as viewer 2. Navigate to /users | 403 page shown | Fail | DASH-BUG-013 |
| DASH-TC-103 | Role badge shown on user profile icon | 1. Login as any role 2. View profile icon/avatar | Role badge visible (Admin / Manager / Viewer) | Pass | — |
| DASH-TC-104 | API endpoints respect role permissions | 1. As viewer, call /api/users (admin-only) directly | 403 Forbidden returned | Pass | — |
| DASH-TC-105 | Permission changes apply without re-deploy | 1. Change user role in admin panel 2. User re-logs in | New permissions active immediately | Pass | — |
| DASH-TC-106 | Guest/unauthenticated user cannot access any API | 1. Call /api/dashboard without auth header | 401 Unauthorized returned | Pass | — |
| DASH-TC-107 | Token-based API access enforced on all endpoints | 1. Remove auth token from API calls | All endpoints return 401 | Pass | — |
| DASH-TC-108 | Expired token returns 401 not 500 | 1. Use an expired JWT token | 401 returned; no server error | Pass | — |
| DASH-TC-109 | Role displayed in admin user list is accurate | 1. View user list as admin | Each user's role shown matches their actual permissions | Pass | — |
| DASH-TC-110 | Admin cannot accidentally delete all admins | 1. Try to deactivate the only admin account | Error: "At least one admin must remain active" | Fail | DASH-BUG-009 |

---

## Area 6: Performance (10 cases)

| TC ID | Test Case | Steps | Expected Result | Status | Bug ID |
|---|---|---|---|---|---|
| DASH-TC-111 | Login page loads in under 3 seconds | Measure login page load time | < 3 seconds | Pass | — |
| DASH-TC-112 | Dashboard home loads in under 5 seconds | Measure dashboard load time after login | < 5 seconds | Pass | — |
| DASH-TC-113 | KPI cards render in under 2 seconds | Measure KPI render time post-login | < 2 seconds | Pass | — |
| DASH-TC-114 | Charts render in under 3 seconds | Measure chart render time | < 3 seconds | Pass | — |
| DASH-TC-115 | Date filter change re-renders in under 3 seconds | Change date range and measure re-render time | < 3 seconds | Pass | — |
| DASH-TC-116 | CSV export of 1-month data completes in under 10 seconds | Trigger export and measure download time | < 10 seconds | Pass | — |
| DASH-TC-117 | PDF report of 1-month data generates in under 30 seconds | Generate PDF and measure time | < 30 seconds | Pass | — |
| DASH-TC-118 | User list with 100 users loads in under 3 seconds | View user list with 100 users in dataset | < 3 seconds | Pass | — |
| DASH-TC-119 | Dashboard usable with 10 concurrent users | Simulate 10 concurrent user sessions | No degradation; response times within acceptable range | Pass | — |
| DASH-TC-120 | Memory usage does not grow excessively over 30 minutes | Monitor browser memory on active dashboard session for 30 min | No memory leak — usage stable | Pass | — |
