# Backend API Documentation

This document provides an overview of the API endpoints available in the backend of the Intermediate Book Management System.

## Base URL
```
http://localhost:5000/api
```

---

## Authentication

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "64a7b8f5e4b0c123456789ab",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "token": "jwt_token_here"
}
```

---

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "64a7b8f5e4b0c123456789ab",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "token": "jwt_token_here"
}
```

---

### Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "message": "If your email is registered, you will receive a password reset link"
}
```

---

## Books

### Get All Books
**GET** `/books`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
[
  {
    "_id": "64a7b8f5e4b0c123456789ab",
    "title": "Physics Book",
    "description": "A comprehensive guide to physics.",
    "publisher": "Science Publishers",
    "year": "2023",
    "user": "64a7b8f5e4b0c123456789ab",
    "createdAt": "2023-07-06T12:34:56.789Z"
  }
]
```

---

### Create Book
**POST** `/books`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "Physics Book",
  "description": "A comprehensive guide to physics.",
  "publisher": "Science Publishers",
  "year": "2023"
}
```

**Response:**
```json
{
  "_id": "64a7b8f5e4b0c123456789ab",
  "title": "Physics Book",
  "description": "A comprehensive guide to physics.",
  "publisher": "Science Publishers",
  "year": "2023",
  "user": "64a7b8f5e4b0c123456789ab",
  "createdAt": "2023-07-06T12:34:56.789Z"
}
```

---

## Subjects

### Get All Subjects
**GET** `/subjects`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
[
  {
    "_id": "64a7b8f5e4b0c123456789ab",
    "name": "Physics",
    "description": "Physics subject for 1st year.",
    "year": "1st",
    "book": "64a7b8f5e4b0c123456789ab",
    "createdAt": "2023-07-06T12:34:56.789Z"
  }
]
```

---

### Create Subject
**POST** `/subjects`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "name": "Physics",
  "description": "Physics subject for 1st year.",
  "year": "1st",
  "book": "64a7b8f5e4b0c123456789ab"
}
```

**Response:**
```json
{
  "_id": "64a7b8f5e4b0c123456789ab",
  "name": "Physics",
  "description": "Physics subject for 1st year.",
  "year": "1st",
  "book": "64a7b8f5e4b0c123456789ab",
  "createdAt": "2023-07-06T12:34:56.789Z"
}
```

---

## Chapters

### Get All Chapters
**GET** `/chapters`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
[
  {
    "_id": "64a7b8f5e4b0c123456789ab",
    "title": "Chapter 1",
    "description": "Introduction to Physics",
    "qrContent": "QR Code Content",
    "qrUrl": "http://example.com/qr",
    "subject": "64a7b8f5e4b0c123456789ab",
    "createdAt": "2023-07-06T12:34:56.789Z"
  }
]
```

---

### Create Chapter
**POST** `/chapters`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "Chapter 1",
  "description": "Introduction to Physics",
  "qrContent": "QR Code Content",
  "qrUrl": "http://example.com/qr",
  "subjectId": "64a7b8f5e4b0c123456789ab"
}
```

**Response:**
```json
{
  "_id": "64a7b8f5e4b0c123456789ab",
  "title": "Chapter 1",
  "description": "Introduction to Physics",
  "qrContent": "QR Code Content",
  "qrUrl": "http://example.com/qr",
  "subject": "64a7b8f5e4b0c123456789ab",
  "createdAt": "2023-07-06T12:34:56.789Z"
}
```

---

## Error Handling
All error responses will have the following format:
```json
{
  "message": "Error message here"
}
```
