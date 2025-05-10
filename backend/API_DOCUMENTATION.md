# Book Management System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except login require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Authentication Endpoints

### Login
```http
POST http://localhost:5000/api/auth/login
```
Request body:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "permissions": ["add-users", "edit-users", ...]
  }
}
```

## User Management

### Get All Users
```http
GET /users
```
Required Permission: `view-users`

### Add User
```http
POST /users
```
Required Permission: `add-users`
Request body:
```json
{
  "name": "New User",
  "email": "user@example.com",
  "phone": "1234567890",
  "password": "password123",
  "roleId": 2
}
```

### Update User
```http
PUT /users/:id
```
Required Permission: `edit-users`
Request body:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "0987654321"
}
```

### Delete User
```http
DELETE /users/:id
```
Required Permission: `delete-users`

## Academic Year Management

### Get All Academic Years
```http
GET /academic-years
```
Response:
```json
[
  {
    "id": 1,
    "label": "2024",
    "books": [],
    "subjects": []
  }
]
```

### Create Academic Year
```http
POST /academic-years
```
Required Permission: `manage-academic-years`
Request body:
```json
{
  "label": "2024"
}
```

### Update Academic Year
```http
PUT /academic-years/:id
```
Required Permission: `manage-academic-years`
Request body:
```json
{
  "label": "2024-2025"
}
```

### Delete Academic Year
```http
DELETE /academic-years/:id
```
Required Permission: `manage-academic-years`

## Branch Management

### Get All Branches
```http
GET /branches
```
Query Parameters:
- `academicYearId` (optional): Filter by academic year

### Create Branch
```http
POST /branches
```
Required Permission: `manage-branches`
Request body:
```json
{
  "name": "Computer Science",
  "location": "Main Campus"
}
```

### Update Branch
```http
PUT /branches/:id
```
Required Permission: `manage-branches`
Request body:
```json
{
  "name": "Updated Branch",
  "location": "New Location"
}
```

### Delete Branch
```http
DELETE /branches/:id
```
Required Permission: `manage-branches`

## Subject Management

### Get All Subjects
```http
GET /subjects
```
Query Parameters:
- `branchId` (optional): Filter by branch
- `academicYearId` (optional): Filter by academic year

### Create Subject
```http
POST /subjects
```
Required Permission: `add-subjects`
Request body:
```json
{
  "name": "Mathematics",
  "description": "Advanced Mathematics",
  "branchId": 1,
  "academicYearId": 1
}
```

### Update Subject
```http
PUT /subjects/:id
```
Required Permission: `edit-subjects`
Request body:
```json
{
  "name": "Updated Subject",
  "description": "New Description",
  "branchId": 1,
  "academicYearId": 1
}
```

### Delete Subject
```http
DELETE /subjects/:id
```
Required Permission: `delete-subjects`

## Book Management

### Get All Books
```http
GET /books
```
Query Parameters:
- `subjectId` (optional): Filter by subject
- `branchId` (optional): Filter by branch
- `academicYearId` (optional): Filter by academic year

### Get Single Book
```http
GET /books/:id
```

### Create Book
```http
POST /books
```
Required Permission: `add-books`
Request body:
```json
{
  "title": "Book Title",
  "description": "Book Description",
  "publisher": "Publisher Name",
  "branchId": 1,
  "academicYearId": 1,
  "subjectIds": ["subject-id-1", "subject-id-2"]
}
```

### Update Book
```http
PUT /books/:id
```
Required Permission: `edit-books`
Request body:
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "publisher": "Updated Publisher",
  "branchId": 1,
  "academicYearId": 1,
  "subjectIds": ["subject-id-1", "subject-id-2"]
}
```

### Delete Book
```http
DELETE /books/:id
```
Required Permission: `delete-books`

## Chapter Management

### Get All Chapters
```http
GET /chapters
```
Query Parameters:
- `subjectId` (optional): Filter by subject
- `bookId` (optional): Filter by book

### Get Single Chapter
```http
GET /chapters/:id
```

### Create Chapter
```http
POST /chapters
```
Required Permission: `add-chapters`
Request body:
```json
{
  "title": "Chapter Title",
  "content": "Chapter Content",
  "subjectId": "subject-id"
}
```

### Update Chapter
```http
PUT /chapters/:id
```
Required Permission: `edit-chapters`
Request body:
```json
{
  "title": "Updated Title",
  "content": "Updated Content",
  "subjectId": "subject-id"
}
```

### Delete Chapter
```http
DELETE /chapters/:id
```
Required Permission: `delete-chapters`

### QR Code Redirect
```http
GET /chapters/qr/:qrCode
```
Public access - No authentication required

## Settings Management

### Get All Settings
```http
GET /settings
```

### Get Setting by Key
```http
GET /settings/:key
```

### Create/Update Setting
```http
POST /settings
```
Required Permission: `manage-settings`
Request body:
```json
{
  "key": "setting_key",
  "value": "setting_value",
  "type": "string" // string, boolean, number, or json
}
```

### Delete Setting
```http
DELETE /settings/:key
```
Required Permission: `manage-settings`

## URL Management

### Get Whitelisted URLs
```http
GET /urls/whitelisted
```
Required Permission: `manage-urls`

### Add Whitelisted URL
```http
POST /urls/whitelisted
```
Required Permission: `manage-urls`
Request body:
```json
{
  "url": "https://example.com"
}
```

### Delete Whitelisted URL
```http
DELETE /urls/whitelisted/:id
```
Required Permission: `manage-urls`

### Get Blocked URLs
```http
GET /urls/blocked
```
Required Permission: `manage-urls`

### Add Blocked URL
```http
POST /urls/blocked
```
Required Permission: `manage-urls`
Request body:
```json
{
  "url": "https://blocked.com"
}
```

### Delete Blocked URL
```http
DELETE /urls/blocked/:id
```
Required Permission: `manage-urls`

### Check URL
```http
POST /urls/check
```
Request body:
```json
{
  "url": "https://example.com"
}
```
Response:
```json
{
  "allowed": true/false,
  "reason": "URL is blocked/not whitelisted"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authorized"
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error"
}
``` 