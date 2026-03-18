# Auth Module Documentation

## Module Path

`ConWise/backend/src/modules/auth`

---

# 1. Purpose of This Module

The `auth` module is responsible for:

- company onboarding
- user authentication
- role-based access
- account verification
- session management
- company user management

This module is designed for a **multi-company platform**.

That means:

- many construction companies can use the same system
- each company has its own users
- users only access data based on their role and company
- the first registered user of a company becomes that company’s admin

---

# 2. Main Idea / Business Design

## 2.1 Platform Model

This system is not treated as a system for only one company.

It is designed as a **shared platform** used by multiple construction companies.

Because of that, the auth module uses these main concepts:

- **Platform Admin**
- **Company**
- **Company Admin**
- **Staff Users**
- **Sessions**
- **Verification Codes**

---

## 2.2 Role Model

The auth module currently supports these roles:

- `PLATFORM_ADMIN`
- `COMPANY_ADMIN`
- `PROJECT_MANAGER`
- `SITE_ENGINEER`
- `SITE_SUPERVISOR`

### Meaning of each role

#### `PLATFORM_ADMIN`
System-level admin of the whole platform.

Can:
- manage all companies
- manage all users
- access all platform-level features

#### `COMPANY_ADMIN`
Admin of a single construction company.

Can:
- manage users in their own company
- invite staff
- create staff users
- change staff roles
- activate / deactivate / suspend staff users

#### `PROJECT_MANAGER`
Company staff user focused on project management.

#### `SITE_ENGINEER`
Company staff user focused on task execution and task progress.

#### `SITE_SUPERVISOR`
Company staff user focused on daily site reports and issue reporting.

---

## 2.3 Important Role Rule

A `COMPANY_ADMIN` can manage only these staff roles:

- `PROJECT_MANAGER`
- `SITE_ENGINEER`
- `SITE_SUPERVISOR`

A `COMPANY_ADMIN` should **not** manage platform-level access.

This protects the system from role abuse.

---

# 3. High-Level Auth Flows

## 3.1 Company Registration Flow

This is the public onboarding flow for a new construction company.

### Steps

1. A company representative opens the registration page.
2. They provide:
   - company name
   - company email or phone
   - company address (optional)
   - first name
   - last name
   - email or phone
   - password
3. System validates the input.
4. System creates:
   - one `Company`
   - one first user with role `COMPANY_ADMIN`
5. System generates a verification code.
6. User verifies the account.
7. User logs in.
8. User is redirected to the company admin dashboard.

### Result

- company is created
- first user becomes `COMPANY_ADMIN`
- account is activated after verification

---

## 3.2 Login Flow

1. User enters:
   - email or phone
   - password
2. System checks:
   - user exists
   - password matches
   - account is verified
   - account is active
   - company is active
3. System issues:
   - access token
   - refresh token
4. System stores refresh token session in database.
5. User is redirected based on role.

---

## 3.3 Invite User Flow

This is used by company admins.

1. `COMPANY_ADMIN` creates an invite for a staff member.
2. System creates the user as:
   - `PENDING_VERIFICATION`
   - `isVerified = false`
3. System creates an `INVITE` verification code.
4. Invited user receives code.
5. Invited user uses `accept-invite`.
6. System sets password and activates account.
7. Invited user logs in.

---

## 3.4 Direct User Creation Flow

A company admin can also directly create a user.

Two cases exist:

### Case A: password provided
- user is created immediately
- user becomes active
- no invite acceptance needed

### Case B: password not provided
- user is created pending verification
- system creates verification/invite code
- user completes setup later

---

## 3.5 Session Management Flow

After login:

- access token is returned
- refresh token is returned
- refresh token is stored in `Session`

The module also supports:

- listing active sessions
- revoking one session
- logging out all sessions

---

# 4. Database Design Used by Auth

This module is built around these main models in Prisma:

## 4.1 `Company`

Represents a construction company using the platform.

Key fields:
- `id`
- `name`
- `email`
- `phone`
- `address`
- `status`

Statuses:
- `PENDING`
- `ACTIVE`
- `SUSPENDED`

---

## 4.2 `User`

Represents a platform user.

Key fields:
- `id`
- `companyId`
- `role`
- `firstName`
- `lastName`
- `email`
- `phone`
- `passwordHash`
- `isVerified`
- `status`
- `lastLoginAt`

Statuses:
- `PENDING_VERIFICATION`
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

---

## 4.3 `Session`

Represents refresh token sessions.

Key fields:
- `id`
- `userId`
- `refreshTokenHash`
- `deviceInfo`
- `ipAddress`
- `userAgent`
- `expiresAt`
- `revokedAt`

---

## 4.4 `VerificationCode`

Used for:
- registration verification
- invite acceptance
- future password reset support

Key fields:
- `id`
- `userId`
- `code`
- `type`
- `expiresAt`
- `usedAt`

Types:
- `EMAIL_VERIFICATION`
- `PHONE_VERIFICATION`
- `PASSWORD_RESET`
- `INVITE`

---

# 5. Files in This Module

## 5.1 `auth.routes.js`

Defines all HTTP routes for the auth module.

Responsibilities:
- route registration
- middleware chaining
- request validation hookup
- role-based route protection

---

## 5.2 `auth.controller.js`

Handles request/response flow.

Responsibilities:
- receive validated request
- call service methods
- return JSON response to client

Controllers should stay thin.

---

## 5.3 `auth.service.js`

Contains the main business logic.

Responsibilities:
- registration logic
- login logic
- token/session logic
- verification logic
- create/invite/list users
- change role
- update user status

This is the most important file in the module.

---

## 5.4 `auth.validation.js`

Contains validation schemas.

Responsibilities:
- validate request body
- validate params
- validate query
- enforce required fields
- enforce correct role and status values

Uses `zod`.

---

## 5.5 `role.service.js`

Contains role and permission helper logic.

Responsibilities:
- determine assignable roles
- determine whether role changes are allowed
- determine whether a user can view another user
- return default dashboard path by role

---

## 5.6 `session.service.js`

Contains refresh-session related logic.

Responsibilities:
- create sessions
- verify refresh tokens
- revoke sessions
- rotate sessions

> Note: some current auth behavior is already handled directly in `auth.service.js`, while `session.service.js` contains reusable session logic for further extension.

---

# 6. Auth Endpoints

Base route:

`/api/auth`

---

# 7. Public Endpoints

These endpoints do **not** require bearer token authentication.

---

## 7.1 Register Company

### Endpoint
`POST /api/auth/register-company`

### Purpose
Registers a new company and creates the first `COMPANY_ADMIN`.

### Access
Public

### Request Body
```/dev/null/register-company.json#L1-11
{
  "companyName": "ABC Construction PLC",
  "companyEmail": "info@abcconstruction.com",
  "companyPhone": "+251911111111",
  "companyAddress": "Addis Ababa",
  "firstName": "Abel",
  "lastName": "Tesfaye",
  "email": "admin@abcconstruction.com",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123"
}
```

### Success Response Example
```/dev/null/register-company-response.json#L1-18
{
  "success": true,
  "message": "Registration successful. Please verify your account using the code sent to you.",
  "data": {
    "user": {},
    "company": {},
    "verification": {
      "verificationId": 1,
      "type": "EMAIL_VERIFICATION",
      "expiresAt": "2026-01-01T10:00:00.000Z"
    }
  }
}
```

---

## 7.2 Login

### Endpoint
`POST /api/auth/login`

### Purpose
Authenticates a user and creates a session.

### Access
Public

### Request Body
```/dev/null/login.json#L1-4
{
  "identifier": "admin@abcconstruction.com",
  "password": "StrongPass123"
}
```

### Success Response Example
```/dev/null/login-response.json#L1-14
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN",
    "refreshTokenExpiresAt": "2026-01-08T10:00:00.000Z",
    "user": {},
    "redirectTo": "/company/dashboard"
  }
}
```

---

## 7.3 Verify Account

### Endpoint
`POST /api/auth/verify-account`

### Purpose
Verifies a newly registered user account.

### Access
Public

### Request Body
```/dev/null/verify-account.json#L1-4
{
  "identifier": "admin@abcconstruction.com",
  "code": "123456"
}
```

---

## 7.4 Resend Verification Code

### Endpoint
`POST /api/auth/resend-verification-code`

### Purpose
Generates a new verification code for unverified users.

### Access
Public

### Request Body
```/dev/null/resend-code.json#L1-3
{
  "identifier": "admin@abcconstruction.com"
}
```

---

## 7.5 Refresh Token

### Endpoint
`POST /api/auth/refresh-token`

### Purpose
Rotates an expired/expiring access session using refresh token.

### Access
Public

### Request Body
```/dev/null/refresh-token.json#L1-3
{
  "refreshToken": "REFRESH_TOKEN"
}
```

---

## 7.6 Logout

### Endpoint
`POST /api/auth/logout`

### Purpose
Revokes a refresh-token session.

### Access
Public in current implementation

### Request Body
```/dev/null/logout.json#L1-3
{
  "refreshToken": "REFRESH_TOKEN"
}
```

---

## 7.7 Accept Invite

### Endpoint
`POST /api/auth/accept-invite`

### Purpose
Allows an invited user to set password and activate account.

### Access
Public

### Request Body
```/dev/null/accept-invite.json#L1-6
{
  "identifier": "engineer@abcconstruction.com",
  "code": "123456",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123"
}
```

---

# 8. Protected Endpoints

These endpoints require:

`Authorization: Bearer <access_token>`

---

# 9. Profile & Session APIs

---

## 9.1 Get My Profile

### Endpoint
`GET /api/auth/me`

### Purpose
Returns current authenticated user profile.

### Access
Authenticated user

### Roles
- all authenticated users

### Example Headers
```/dev/null/auth-header.txt#L1-1
Authorization: Bearer ACCESS_TOKEN
```

---

## 9.2 Get My Sessions

### Endpoint
`GET /api/auth/me/sessions`

### Purpose
Lists active sessions for the current user.

### Access
Authenticated user

### Roles
- all authenticated users

---

## 9.3 Revoke One Session

### Endpoint
`DELETE /api/auth/me/sessions/:sessionId`

### Purpose
Revokes one specific session for current user.

### Access
Authenticated user

### Roles
- all authenticated users

### Example
`DELETE /api/auth/me/sessions/5`

---

## 9.4 Logout All Sessions

### Endpoint
`POST /api/auth/me/logout-all`

### Purpose
Revokes all active sessions for current user.

### Access
Authenticated user

### Roles
- all authenticated users

---

# 10. Company User Management APIs

These APIs are mainly for `COMPANY_ADMIN` and `PLATFORM_ADMIN`.

---

## 10.1 Create User

### Endpoint
`POST /api/auth/users`

### Purpose
Creates a user inside the company.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

### Notes
- if password is provided, user can become active immediately
- if password is omitted, user stays pending and verification code is generated

### Request Body Example
```/dev/null/create-user.json#L1-7
{
  "firstName": "Nahom",
  "lastName": "Bekele",
  "email": "nahom@abcconstruction.com",
  "password": "StrongPass123",
  "role": "SITE_ENGINEER"
}
```

### Response
```/dev/null/create-user-response.json#L1-12
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "user": {},
    "verification": null
  }
}
```

---

## 10.2 Invite User

### Endpoint
`POST /api/auth/users/invite`

### Purpose
Creates a pending user and generates invite code.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

### Request Body Example
```/dev/null/invite-user.json#L1-6
{
  "firstName": "Rahel",
  "lastName": "Abebe",
  "email": "rahel@abcconstruction.com",
  "role": "SITE_SUPERVISOR"
}
```

### Response
```/dev/null/invite-user-response.json#L1-14
{
  "success": true,
  "message": "User invited successfully.",
  "data": {
    "user": {},
    "invite": {
      "verificationId": 4,
      "type": "INVITE",
      "expiresAt": "2026-01-01T10:00:00.000Z"
    }
  }
}
```

---

## 10.3 List Company Users

### Endpoint
`GET /api/auth/users`

### Purpose
Returns users of the current company.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

### Query Parameters
- `page`
- `limit`
- `role`
- `status`
- `search`

### Example
```/dev/null/list-users-url.txt#L1-1
GET /api/auth/users?page=1&limit=10&role=SITE_ENGINEER&status=ACTIVE&search=nahom
```

### Response Shape
```/dev/null/list-users-response.json#L1-16
{
  "success": true,
  "message": "Users fetched successfully.",
  "data": {
    "users": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

## 10.4 Get Individual User

### Endpoint
`GET /api/auth/users/:userId`

### Purpose
Returns one user by id.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

### Example
```/dev/null/get-user.txt#L1-1
GET /api/auth/users/12
```

---

## 10.5 Change User Role

### Endpoint
`PATCH /api/auth/users/:userId/role`

### Purpose
Changes a user's role.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

### Important Rule
A `COMPANY_ADMIN` can only change staff roles among:
- `PROJECT_MANAGER`
- `SITE_ENGINEER`
- `SITE_SUPERVISOR`

### Request Body Example
```/dev/null/change-role.json#L1-3
{
  "role": "PROJECT_MANAGER"
}
```

---

## 10.6 Update User Status

### Endpoint
`PATCH /api/auth/users/:userId/status`

### Purpose
Changes a user’s status directly.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

### Allowed Status Values
- `PENDING_VERIFICATION`
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

### Request Body Example
```/dev/null/update-status.json#L1-3
{
  "status": "INACTIVE"
}
```

---

## 10.7 Deactivate User

### Endpoint
`PATCH /api/auth/users/:userId/deactivate`

### Purpose
Shortcut endpoint to set status to `INACTIVE`.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

---

## 10.8 Activate User

### Endpoint
`PATCH /api/auth/users/:userId/activate`

### Purpose
Shortcut endpoint to set status to `ACTIVE`.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

---

## 10.9 Suspend User

### Endpoint
`PATCH /api/auth/users/:userId/suspend`

### Purpose
Shortcut endpoint to set status to `SUSPENDED`.

### Access
Protected

### Roles Allowed
- `COMPANY_ADMIN`
- `PLATFORM_ADMIN`

---

# 11. Role Access Matrix

| API | Public | Authenticated | COMPANY_ADMIN | PLATFORM_ADMIN | Staff User |
|---|---|---:|---:|---:|---:|
| `POST /register-company` | Yes | No | No | No | No |
| `POST /login` | Yes | No | No | No | No |
| `POST /verify-account` | Yes | No | No | No | No |
| `POST /resend-verification-code` | Yes | No | No | No | No |
| `POST /refresh-token` | Yes | No | No | No | No |
| `POST /logout` | Yes | No | No | No | No |
| `POST /accept-invite` | Yes | No | No | No | No |
| `GET /me` | No | Yes | Yes | Yes | Yes |
| `GET /me/sessions` | No | Yes | Yes | Yes | Yes |
| `DELETE /me/sessions/:sessionId` | No | Yes | Yes | Yes | Yes |
| `POST /me/logout-all` | No | Yes | Yes | Yes | Yes |
| `POST /users` | No | Yes | Yes | Yes | No |
| `POST /users/invite` | No | Yes | Yes | Yes | No |
| `GET /users` | No | Yes | Yes | Yes | No |
| `GET /users/:userId` | No | Yes | Yes | Yes | No |
| `PATCH /users/:userId/role` | No | Yes | Yes | Yes | No |
| `PATCH /users/:userId/status` | No | Yes | Yes | Yes | No |
| `PATCH /users/:userId/deactivate` | No | Yes | Yes | Yes | No |
| `PATCH /users/:userId/activate` | No | Yes | Yes | Yes | No |
| `PATCH /users/:userId/suspend` | No | Yes | Yes | Yes | No |

---

# 12. Validation Rules

The module currently validates:

- email format
- phone format
- password minimum length
- matching password + confirmPassword
- required identifier fields
- valid role enum values
- valid status enum values
- positive numeric ids
- pagination limits

---

# 13. Security Rules Currently Enforced

## Authentication
Protected routes require bearer token.

## Session security
Refresh tokens are hashed in DB.

## Password security
Passwords are hashed before saving.

## Company isolation
Company admins only operate on users within their own company.

## Role restrictions
Role changes are restricted using `role.service.js`.

## Self-protection
The module blocks some unsafe self-management behavior such as:
- changing own role
- changing own status

---

# 14. Current Implementation Notes

## 14.1 `logout` is public
`POST /api/auth/logout` currently works with refresh token payload and does not require bearer token.

This is acceptable for token revocation because the refresh token itself identifies the session to revoke.

---

## 14.2 Invite code delivery
The module creates invite/verification code records, but actual email/SMS delivery is not implemented here.

So for real deployment, you still need:
- email sending integration
- or SMS integration

For development/testing, you may temporarily expose codes in responses if desired.

---

## 14.3 Platform admin support
The service includes support for `PLATFORM_ADMIN`, but in a real production setup, that role is usually:
- seeded manually
- not publicly registered

---

# 15. Recommended Postman Testing Order

Use this testing order for easiest understanding.

## Scenario A: New company onboarding

### Step 1
`POST /api/auth/register-company`

### Step 2
Take verification code from database or development response.

### Step 3
`POST /api/auth/verify-account`

### Step 4
`POST /api/auth/login`

### Step 5
Copy returned `accessToken`

### Step 6
Call:
`GET /api/auth/me`

---

## Scenario B: Company admin creates staff directly

### Step 1
Login as company admin

### Step 2
Use bearer token

### Step 3
Call:
`POST /api/auth/users`

### Step 4
Login with newly created staff account

---

## Scenario C: Company admin invites staff

### Step 1
Login as company admin

### Step 2
Call:
`POST /api/auth/users/invite`

### Step 3
Take invite code

### Step 4
Call:
`POST /api/auth/accept-invite`

### Step 5
Login as invited user

---

## Scenario D: User management

### Step 1
Login as company admin

### Step 2
Call:
`GET /api/auth/users`

### Step 3
Call:
`GET /api/auth/users/:userId`

### Step 4
Call:
`PATCH /api/auth/users/:userId/role`

### Step 5
Call:
`PATCH /api/auth/users/:userId/status`

---

## Scenario E: Session management

### Step 1
Login

### Step 2
Call:
`GET /api/auth/me/sessions`

### Step 3
Call:
`DELETE /api/auth/me/sessions/:sessionId`

### Step 4
Call:
`POST /api/auth/me/logout-all`

---

# 16. Suggested Postman Collection Variables

Recommended Postman variables:

```/dev/null/postman-vars.txt#L1-8
baseUrl = http://localhost:5000/api
accessToken = 
refreshToken = 
companyAdminEmail = 
companyAdminPassword = 
staffEmail = 
staffPassword = 
userId = 
```

Use header on protected endpoints:

```/dev/null/postman-auth-header.txt#L1-2
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

---

# 17. Common Testing Notes

## If login fails
Check:
- account is verified
- user status is `ACTIVE`
- company status is `ACTIVE`
- password is correct

## If verification fails
Check:
- code is correct
- code is not expired
- code is not already used
- identifier matches correct user

## If user management fails with forbidden
Check:
- logged in user role
- company scope
- whether target user role is allowed to be managed

---

# 18. Quick Summary for Teammates

If you want to understand the module quickly, remember this:

1. A company registers through `register-company`
2. The first created user becomes `COMPANY_ADMIN`
3. That user verifies account and logs in
4. `COMPANY_ADMIN` can:
   - create staff
   - invite staff
   - list users
   - get one user
   - change role
   - activate/deactivate/suspend users
5. All authenticated users can:
   - get their own profile
   - manage their own sessions
6. All access is role-based and company-scoped

---

# 19. Future Improvements

Possible next improvements:

- email sending integration
- SMS sending integration
- forgot password flow
- reset password flow
- account lockout / brute-force protection
- audit logs for role/status changes
- company admin invitation to create another company admin through controlled approval
- platform admin management module

---

# 20. Conclusion

This auth module now provides a complete foundation for:

- multi-company onboarding
- secure login
- verification
- role-based access
- user administration
- session control

It is suitable as the base auth subsystem for the Construction Project Collaboration and Reporting System platform.

---