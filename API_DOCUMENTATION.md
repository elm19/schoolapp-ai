# API Documentation

## Overview

SchoolApp AI provides a comprehensive REST API for managing courses, projects, quizzes, and user data. All API endpoints are located in `app/api/` and use Next.js API routes.

## Authentication

All endpoints (except auth endpoints) require authentication via Supabase session. Authentication is automatically handled through:

- Session cookies (set during login)
- Server-side session validation via `@supabase/ssr`

## API Endpoints

### 1. Course Enrollment

**Endpoint**: `POST /api/enroll-course`

Enrolls an authenticated user in a course.

**Request Body**:

```json
{
  "courseId": "uuid",
  "userId": "uuid"
}
```

**Response**:

```json
{
  "success": boolean,
  "message": string,
  "enrollment": {
    "id": "uuid",
    "userId": "uuid",
    "courseId": "uuid",
    "enrolledAt": "timestamp"
  }
}
```

**Status Codes**:

- `200`: Successfully enrolled
- `400`: Invalid course or user ID
- `401`: Unauthorized
- `409`: Already enrolled

---

### 2. PDF Extraction

**Endpoint**: `POST /api/extract-pdf`

Extracts text content from uploaded PDF files.

**Request Body** (FormData):

```
file: File (PDF)
```

**Response**:

```json
{
  "success": boolean,
  "text": "Extracted text content...",
  "pages": number,
  "metadata": {
    "fileName": "string",
    "uploadedAt": "timestamp"
  }
}
```

**Status Codes**:

- `200`: PDF extracted successfully
- `400`: Invalid PDF file
- `413`: File too large
- `422`: Unprocessable PDF

---

### 3. Gemini AI Integration

**Endpoint**: `POST /api/gemini-ai`

Communicates with Google Gemini AI for intelligent features like quiz generation and content analysis.

**Request Body**:

```json
{
  "prompt": "string",
  "context": "string (optional)",
  "model": "gemini-1.5-flash (optional, defaults to available model)"
}
```

**Response**:

```json
{
  "success": boolean,
  "response": "AI generated response...",
  "tokens": {
    "input": number,
    "output": number
  },
  "timestamp": "timestamp"
}
```

**Status Codes**:

- `200`: AI response generated successfully
- `400`: Invalid prompt
- `401`: Unauthorized
- `500`: AI service error

**Features**:

- Auto-detects user's API key from `gemini_keys` table
- Falls back to server-side API key if not found
- Rate limiting for cost control

---

### 4. Quiz Submission

**Endpoint**: `POST /api/submit-quiz`

Submits a quiz attempt and records the score.

**Request Body**:

```json
{
  "quizId": "uuid",
  "userId": "uuid",
  "answers": [
    {
      "questionId": "uuid",
      "selectedAnswer": "string",
      "isCorrect": boolean
    }
  ],
  "score": number,
  "timeSpent": number
}
```

**Response**:

```json
{
  "success": boolean,
  "submission": {
    "id": "uuid",
    "quizId": "uuid",
    "userId": "uuid",
    "score": number,
    "percentage": number,
    "submittedAt": "timestamp"
  }
}
```

**Status Codes**:

- `200`: Quiz submitted successfully
- `400`: Invalid quiz or answers
- `401`: Unauthorized
- `409`: Quiz already submitted

---

### 5. Student Information

**Endpoint**: `GET/POST /api/student`

Retrieves or updates student information.

**GET Parameters**:

```
userId: uuid
```

**GET Response**:

```json
{
  "student": {
    "id": "uuid",
    "userId": "uuid",
    "enrolledCourses": number,
    "activeProjects": number,
    "completedQuizzes": number,
    "averageScore": number
  }
}
```

**POST Request Body**:

```json
{
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "school": "string"
}
```

**Status Codes**:

- `200`: Success
- `400`: Invalid data
- `401`: Unauthorized
- `404`: Student not found

---

### 6. User Photo Upload

**Endpoint**: `POST /api/userphoto`

Uploads or updates user profile photo.

**Request Body** (FormData):

```
photo: File (image)
```

**Response**:

```json
{
  "success": boolean,
  "url": "https://...",
  "message": "Photo uploaded successfully"
}
```

**Status Codes**:

- `200`: Photo uploaded successfully
- `400`: Invalid file format
- `413`: File too large
- `401`: Unauthorized

---

### 7. SchoolApp Connect Integration

**Endpoint**: `POST /api/schoolapp-connect`

Integrates with external SchoolApp platform for data synchronization.

**Request Body**:

```json
{
  "action": "sync|import|export",
  "data": {}
}
```

**Response**:

```json
{
  "success": boolean,
  "message": "string",
  "syncedRecords": number
}
```

**Status Codes**:

- `200`: Integration successful
- `400`: Invalid action
- `401`: Unauthorized
- `502`: External service error

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": "Additional details (optional)"
}
```

**Common Error Codes**:

- `UNAUTHORIZED` - User not authenticated
- `FORBIDDEN` - User lacks required permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `SERVER_ERROR` - Internal server error

---

## Rate Limiting

- **Default**: 100 requests per minute per user
- **AI Endpoints**: 30 requests per hour per user (to manage API costs)
- **File Upload**: 10 requests per minute per user

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters**:

```
page: number (default: 1)
limit: number (default: 20, max: 100)
```

**Response**:

```json
{
  "data": [],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

---

## Best Practices

1. **Always include error handling** in client-side API calls
2. **Use request timeouts** to prevent hanging requests (30s recommended)
3. **Cache responses** where appropriate to reduce API calls
4. **Validate data** on both client and server
5. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
6. **Include proper headers** (Content-Type, Authorization)

---

## Testing

Example using fetch:

```javascript
// Enroll in course
const response = await fetch("/api/enroll-course", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    courseId: "course-id",
    userId: "user-id",
  }),
});

const data = await response.json();
if (data.success) {
  console.log("Enrolled successfully:", data.enrollment);
} else {
  console.error("Enrollment failed:", data.error);
}
```

---

## Version

Current API version: **v1**

All endpoints are prefix-free. Future versions will use `/api/v2/` pattern for breaking changes.
