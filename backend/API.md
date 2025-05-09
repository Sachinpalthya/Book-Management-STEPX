# Book Management BHE API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Error Responses
All endpoints may return these error responses:
```json
{
  "message": "Error message description"
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "token": "string"
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "token": "string"
}
```

## Books

### Get All Books
```http
GET /books
```

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "publisher": "string",
    "year": "string",
    "createdAt": "string"
  }
]
```

### Create Book
```http
POST /books
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "publisher": "string",
  "year": "string"
}
```

### Update Book
```http
PUT /books/:id
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "publisher": "string",
  "year": "string"
}
```

### Delete Book
```http
DELETE /books/:id
```

## Subjects

### Get Subjects by Year
```http
GET /subjects?year=1st
```

**Query Parameters:**
- `year` (optional): '1st', '2nd', or 'Masters'

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "year": "string",
    "book": {
      "_id": "string",
      "title": "string"
    },
    "createdAt": "string"
  }
]
```

### Create Subject
```http
POST /subjects
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "year": "string",
  "book": "string"
}
```

### Upload Subject File
```http
POST /subjects/upload
```

**Request Body:**
- Content-Type: multipart/form-data
```
file: File (PDF or Excel)
year: string
book: string
```

**Response:**
```json
{
  "subject": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "year": "string",
    "book": "string"
  },
  "chapters": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "qrContent": "string",
      "qrUrl": "string",
      "subject": "string"
    }
  ]
}
```

## Chapters

### Get Chapters
```http
GET /chapters
```

**Query Parameters:**
- `subject` (optional): Subject ID to filter chapters

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "qrContent": "string",
    "qrUrl": "string",
    "subject": {
      "_id": "string",
      "name": "string"
    },
    "subQRs": [
      {
        "title": "string",
        "qrContent": "string",
        "isActive": "boolean",
        "createdAt": "string"
      }
    ]
  }
]
```

### Create Chapter
```http
POST /chapters
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "subjectId": "string"
}
```

### Create Chapters from PDF
```http
POST /chapters/pdf
```

**Request Body:**
```json
{
  "chapters": [
    {
      "title": "string",
      "content": "string"
    }
  ],
  "subjectId": "string"
}
```

### Update Chapter URL
```http
PATCH /chapters/:chapterId/url
```

**Request Body:**
```json
{
  "qrUrl": "string"
}
```

### Access QR Content
```http
GET /chapters/qr/:qrId
```

**Response:**
- Redirects to the stored URL if it's a single URL
- Returns HTML page with multiple links if it contains sub-QRs

## Error Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## File Upload Specifications
- Supported file types: PDF (.pdf), Excel (.xlsx)
- Maximum file size: 10MB
- PDF files should contain a table of contents for chapter extraction
- Excel files should follow the template format with columns: Title, Content
