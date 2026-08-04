# API Bug Reports — API-BUG-001 to API-BUG-032
**Project:** Postman API Validation Suite
**Tester:** Muhammad Mehboob
**API Under Test:** Reqres.in REST API
**Acceptance Rate:** 95%

---

## API-BUG-001 | Login returns 200 OK for invalid credentials instead of 401

**Severity:** High
**Priority:** High
**Status:** Open — By Design (documented limitation)

**Endpoint:** `POST /api/login`

**Summary:** When invalid credentials are submitted, the API returns `HTTP 400 Bad Request` instead of the more semantically correct `HTTP 401 Unauthorized`. While the error body correctly indicates failure, consuming clients that check status codes for auth success/failure will need additional body parsing logic.

**Request:**
```json
{ "email": "wrong@email.com", "password": "wrongpass" }
```

**Expected Response:** HTTP 401 Unauthorized
**Actual Response:** HTTP 400 Bad Request with body `{ "error": "user not found" }`

**Impact:** API clients relying on HTTP status code conventions for auth handling may misclassify this as a validation error rather than an authentication failure.

---

## API-BUG-002 | Register endpoint accepts undefined email addresses

**Severity:** High
**Priority:** High
**Status:** Open

**Endpoint:** `POST /api/register`

**Summary:** The register endpoint accepts any email/password combination — including email addresses that do not exist in the system — and returns a 400 error. However, the error message "Note: Only defined users succeed registration" is misleading and exposes internal API logic to end users.

**Expected Result:** Generic validation error without revealing registration system internals.
**Actual Result:** Error message exposes implementation detail.

---

## API-BUG-003 | DELETE returns 204 for both existing and non-existing resources

**Severity:** Medium
**Priority:** Medium
**Status:** Open — By Design (documented)

**Endpoint:** `DELETE /api/users/:id`

**Summary:** Deleting a user with ID 2 (exists) and ID 999 (does not exist) both return `HTTP 204 No Content`. This makes it impossible for API clients to distinguish between a successful deletion and an attempt to delete a non-existent resource.

**Expected Result:** `204` for existing resource, `404` for non-existing resource.
**Actual Result:** `204` in both cases.

---

## API-BUG-004 | createdAt timestamp lacks timezone information

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `POST /api/users`

**Summary:** The `createdAt` field in the create user response returns an ISO 8601 timestamp but without explicit UTC offset or `Z` suffix in some responses, making the timezone ambiguous for international clients.

**Example Response:**
```json
{ "createdAt": "2024-01-15T10:23:41.123" }
```

**Expected Result:** `"createdAt": "2024-01-15T10:23:41.123Z"` (with UTC marker)
**Actual Result:** Timestamp without consistent timezone marker

---

## API-BUG-005 | GET /users?page=999 returns 200 with empty data instead of 404

**Severity:** Low
**Priority:** Low
**Status:** Open — By Design

**Endpoint:** `GET /api/users?page=999`

**Summary:** Requesting a page number that exceeds the total number of pages returns `HTTP 200 OK` with an empty `data` array rather than `HTTP 404 Not Found` or `HTTP 416 Range Not Satisfiable`. While functional, this is inconsistent with REST conventions.

**Expected Result:** `HTTP 404` or appropriate out-of-range status.
**Actual Result:** `HTTP 200` with `{ "data": [], "page": 999, ... }`

---

## API-BUG-006 | User avatar URLs use HTTP not HTTPS

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `GET /api/users`

**Summary:** Several user avatar URLs in the API response use `http://` instead of `https://`, which causes mixed content warnings in browsers loading the API data in a secure context.

**Expected Result:** All avatar URLs use `https://`.
**Actual Result:** Some avatar URLs use `http://`.

---

## API-BUG-007 | PATCH /users/:id with empty body still returns updatedAt

**Severity:** Low
**Priority:** Low
**Status:** Open — Documented

**Endpoint:** `PATCH /api/users/2`

**Summary:** Sending a PATCH request with an empty body `{}` returns `HTTP 200` with an `updatedAt` timestamp, implying the resource was updated — even though no fields were changed. This can cause unnecessary cache invalidation in client applications.

**Expected Result:** Either `304 Not Modified` or validation requiring at least one field.
**Actual Result:** `200 OK` with updated timestamp on no-op request.

---

## API-BUG-008 | API does not return standard error format across all endpoints

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** Multiple

**Summary:** Error responses are inconsistent across endpoints. Login errors return `{ "error": "string" }`, while some endpoints return empty objects `{}` for 404s and others return no body at all. A standard error envelope would improve API usability.

**Expected Result:** Consistent error format: `{ "error": { "code": "...", "message": "..." } }`
**Actual Result:** Three different error formats across endpoints.

---

## API-BUG-009 | No rate limiting on login endpoint

**Severity:** High
**Priority:** High
**Status:** Open

**Endpoint:** `POST /api/login`

**Summary:** The login endpoint has no observable rate limiting. Sending 100+ rapid requests returns `200` or `400` responses without any `429 Too Many Requests` or throttling behaviour. In a production context, this would leave the endpoint vulnerable to brute-force attacks.

**Test Performed:** 100 rapid login attempts via Newman — no 429 response received.

**Expected Result:** `429 Too Many Requests` after a threshold of failed attempts.
**Actual Result:** All requests processed without throttling.

---

## API-BUG-010 | GET /users/0 returns 404 but GET /users/-1 returns 404 with empty body inconsistently

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `GET /api/users/:id`

**Summary:** Both `/users/0` and `/users/-1` return `404`, but the response body structure differs: `/users/0` returns `{}` while `/users/-1` may return different content depending on the server instance.

**Expected Result:** Consistent 404 response body for all invalid user IDs.
**Actual Result:** Inconsistent response bodies for boundary ID values.

---

## API-BUG-011 | Content-Type header not enforced on POST endpoints

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `POST /api/users`, `POST /api/login`

**Summary:** Sending a POST request without a `Content-Type: application/json` header still returns a successful response. The API should enforce content type to prevent malformed request processing.

**Test:** Removed `Content-Type` header from POST /users — still returns `201 Created`.

**Expected Result:** `415 Unsupported Media Type` when Content-Type is missing.
**Actual Result:** `201 Created` — request processed without Content-Type header.

---

## API-BUG-012 | PUT /users/:id does not validate required fields

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `PUT /api/users/2`

**Summary:** A PUT request (full resource update) with an empty body `{}` returns `200 OK` with only an `updatedAt` field. PUT semantics require the full resource representation to be provided — an empty PUT should either be rejected or documented as a special case.

**Expected Result:** `400 Bad Request` for empty PUT body.
**Actual Result:** `200 OK` with `{ "updatedAt": "..." }`

---

## API-BUG-013 | No HATEOAS links in user list response

**Severity:** Low
**Priority:** Low
**Status:** Open — Enhancement Request

**Endpoint:** `GET /api/users`

**Summary:** The user list response does not include pagination navigation links (e.g., `next`, `prev`, `first`, `last`), requiring clients to construct pagination URLs manually from `page` and `total_pages` values.

**Expected Result:** `"links": { "next": "/api/users?page=2", "prev": null }` in response.
**Actual Result:** No navigation links in response.

---

## API-BUG-014 | Single user response wraps data in object — inconsistent with list format

**Severity:** Low
**Priority:** Low
**Status:** Open — By Design (documented)

**Endpoint:** `GET /api/users/2`

**Summary:** The single user endpoint returns `{ "data": { user object }, "support": {} }` while the list endpoint returns `{ "data": [ array ], "page": ..., "support": {} }`. While not technically incorrect, the wrapping of both in a `data` key (object vs array) can cause issues for clients not handling both types.

---

## API-BUG-015 | Register endpoint error message reveals valid email list

**Severity:** High
**Priority:** High
**Status:** Open

**Endpoint:** `POST /api/register`

**Summary:** The note in the register error response ("Note: Only defined users succeed registration") combined with the ability to test any email address effectively allows enumeration of which email addresses are "defined" in the system, as defined emails return a token while undefined ones return an error.

**Expected Result:** Both defined and undefined emails should return the same generic error on registration failure.
**Actual Result:** Different response bodies for defined vs undefined email addresses.

---

## API-BUG-016 | Response time degrades on page 2 vs page 1

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `GET /api/users?page=2`

**Summary:** GET /users?page=1 consistently responds in under 500ms, while GET /users?page=2 averages 200ms slower across 20 test runs. While both are within acceptable limits, the inconsistency suggests a potential caching issue where only page 1 is cached.

---

## API-BUG-017 | No CORS headers on API responses

**Severity:** Medium
**Priority:** Medium
**Status:** Open — By Design for API testing context

**Endpoint:** All

**Summary:** API responses do not include `Access-Control-Allow-Origin` headers in some test environments, which would prevent direct browser-based API consumption from different origins without a proxy.

---

## API-BUG-018 | createdAt and updatedAt use different timestamp precision

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `POST /api/users`, `PUT /api/users/2`

**Summary:** `createdAt` timestamps include milliseconds (e.g., `2024-01-15T10:23:41.123Z`) while `updatedAt` timestamps sometimes omit milliseconds (e.g., `2024-01-15T10:25:00Z`). Inconsistent timestamp precision can cause issues in date comparison and sorting logic.

---

## API-BUG-019 | API does not validate email format on login

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `POST /api/login`

**Summary:** The login endpoint accepts strings that are not valid email addresses (e.g., `"notanemail"`, `"@"`, `"a@"`) and returns the standard "Missing email or password" or "user not found" errors rather than a validation error specifying the invalid format.

**Expected Result:** `400` with message "Invalid email format."
**Actual Result:** `400` with generic "user not found" or "Missing" error.

---

## API-BUG-020 | GET /users single response includes support block with promotional content

**Severity:** Low
**Priority:** Low
**Status:** Open — By Design

**Endpoint:** `GET /api/users/:id`

**Summary:** Every GET user response includes a `support` block containing a URL and promotional text for the API service. This non-resource data mixed into resource responses is a REST design smell and can pollute client data models if not explicitly stripped.

---

## API-BUG-021 | POST /users accepts and stores XSS payload in name field

**Severity:** High
**Priority:** High
**Status:** Open

**Endpoint:** `POST /api/users`

**Summary:** Submitting `<script>alert('xss')</script>` as the `name` field returns it verbatim in the response. While this is a simulated API, in a real system this would indicate a lack of output encoding that could lead to stored XSS if this data is ever rendered in a browser.

---

## API-BUG-022 | No validation on name field length

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `POST /api/users`

**Summary:** The `name` field accepts strings of any length including a 5000-character string — with no validation error. There should be a maximum length enforced and a `400` returned for oversized payloads.

---

## API-BUG-023 | Integer passed as name field is accepted without error

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `POST /api/users`

**Summary:** Sending `{ "name": 12345, "job": "QA" }` is accepted and returns `201` with the integer coerced to a string in the response. Type enforcement should reject non-string values for string fields.

---

## API-BUG-024 | Null value in name field causes unexpected behavior

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `POST /api/users`

**Summary:** Sending `{ "name": null, "job": "QA" }` returns `201 Created` with `"name": null` in the response. Null values should either be rejected or explicitly documented as valid.

---

## API-BUG-025 | Boolean passed as job field accepted silently

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `POST /api/users`

**Summary:** `{ "name": "Test", "job": true }` returns `201` — the boolean `true` is stored as the job value without a type validation error.

---

## API-BUG-026 | Missing Content-Type on PATCH request not rejected

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `PATCH /api/users/2`

**Summary:** PATCH request without `Content-Type: application/json` still returns `200 OK`. Content-Type should be enforced to prevent unexpected request body parsing.

---

## API-BUG-027 | No idempotency key support on POST /users

**Severity:** Medium
**Priority:** Medium
**Status:** Open — Enhancement Request

**Endpoint:** `POST /api/users`

**Summary:** Sending the same POST /users request twice creates two separate user records with different IDs. There is no support for idempotency keys (e.g., `Idempotency-Key` header) to prevent duplicate resource creation on network retry scenarios.

---

## API-BUG-028 | Large page number in query param not validated

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `GET /api/users?page=99999999`

**Summary:** Extremely large page numbers in the `page` query parameter return `200 OK` with empty data instead of a `400 Bad Request` with a validation message about the valid page range.

---

## API-BUG-029 | Negative page number in query param not rejected

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `GET /api/users?page=-1`

**Summary:** `page=-1` returns `200 OK` with data — the negative value appears to be treated as page 1. Negative page numbers should return a `400 Bad Request`.

---

## API-BUG-030 | String value for page param not rejected

**Severity:** Low
**Priority:** Low
**Status:** Open

**Endpoint:** `GET /api/users?page=abc`

**Summary:** `page=abc` returns `200 OK` with data — the string is silently coerced to a default page value. Type validation should reject non-integer page values.

---

## API-BUG-031 | API version not included in response headers

**Severity:** Low
**Priority:** Low
**Status:** Open — Enhancement Request

**Endpoint:** All

**Summary:** No `API-Version` or `X-API-Version` header is returned in responses. Versioning headers help clients detect breaking changes and manage backward compatibility.

---

## API-BUG-032 | Delayed response endpoint (/users?delay=3) accepts any delay value

**Severity:** Medium
**Priority:** Medium
**Status:** Open

**Endpoint:** `GET /api/users?delay=30`

**Summary:** The delay parameter (documented max: 3 seconds) accepts values up to 30+ seconds without capping or rejecting them. Clients can use this to trigger intentional timeouts or DDOS the delay endpoint with very high values.

**Expected Result:** Delay capped at documented maximum (3 seconds).
**Actual Result:** `delay=30` causes a 30-second response time.
