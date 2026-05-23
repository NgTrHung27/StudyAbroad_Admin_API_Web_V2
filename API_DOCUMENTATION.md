# StudyAbroad Admin API Documentation

## Base URL
```
Production: https://your-domain.vercel.app
Development: http://localhost:3000
```

---

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "token": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

> **LƯU Ý QUAN TRỌNG VỀ AUTHENTICATION:**
> Sau khi đăng nhập thành công, App cần lưu lại `token` và `refreshToken` vào local storage.
> Đối với tất cả các API khác (ngoại trừ `/api/schools`, `/api/news`, `/api/country`, `/api/nameSchools`), App phải gửi kèm token trong header của request:
> `Authorization: Bearer <token>`

### Get Current Profile (Me)
API này được dùng để lấy thông tin `UserAuthLogin` của user đang đăng nhập dựa vào token.
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "Nguyen Van A",
    "phoneNumber": "0909123456",
    "dob": "2006-01-01T00:00:00.000Z",
    "student": {
      "id": "clx456...",
      "studentCode": "STU001",
      "status": "APPROVED",
      "degreeType": "HIGHSCHOOL",
      "certificateType": "IELTS",
      "gradeType": "GPA",
      "gradeScore": 3.5
    }
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "Nguyen Van Student",
  "phoneNumber": "0909123456",
  "idCardNumber": "123456789012",
  "dob": "2006-01-01T00:00:00.000Z",
  "gender": "MALE",
  "addressLine": "123 Street",
  "city": "Ho Chi Minh",
  "district": "District 1",
  "ward": "Ward 1",
  "schoolName": "Canada International School",
  "programName": "Computer Science",
  "degreeType": "HIGHSCHOOL",
  "certificateType": "IELTS",
  "gradeType": "GPA",
  "gradeScore": "3.5"
}
```

---

## Schools API

### Get All Schools
```http
GET /api/schools
```

**Response (200):**
```json
[
  {
    "id": "clx123...",
    "name": "Canada International School",
    "logo": "https://...",
    "background": "https://...",
    "short": "CIS",
    "description": "...",
    "country": "CANADA",
    "isPublished": true,
    "programs": [
      { "name": "Computer Science" },
      { "name": "Business Administration" }
    ]
  }
]
```

### Get School by ID
```http
GET /api/schools/{schoolId}
```

### Get Schools with Full Details
```http
GET /api/schools/full
```

---

## News API

### Get All News
```http
GET /api/news
```

**Response (200):**
```json
[
  {
    "id": "clx123...",
    "title": "Tuyển sinh 2026",
    "content": "Nội dung tin tức...",
    "type": "ANNOUNCEMENT",
    "cover": "https://...",
    "isPublished": true,
    "school": {
      "name": "Canada International School"
    },
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### Get News by ID
```http
GET /api/news/{newsId}
```

---

## Accounts API

### Get Account by ID
```http
GET /api/accounts/{accountId}
```

**Response (200):**
```json
{
  "id": "clx123...",
  "email": "student@example.com",
  "name": "Nguyen Van Student",
  "phoneNumber": "0909123456",
  "dob": "2006-01-01T00:00:00.000Z",
  "emailVerified": "2026-01-01T00:00:00.000Z",
  "student": {
    "id": "clx456...",
    "studentCode": "STU001",
    "status": "APPROVED",
    "degreeType": "HIGHSCHOOL",
    "certificateType": "IELTS",
    "gradeType": "GPA",
    "gradeScore": 3.5
  }
}
```

---

## Notifications API

### Get Notifications by User ID
```http
GET /api/notifications/{userId}
```

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "clx123...",
      "title": "Thông báo mới",
      "body": "Nội dung thông báo",
      "type": "ANNOUNCEMENT",
      "isRead": false,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

### Upsert FCM Token
```http
POST /api/notifications
Content-Type: application/json

{
  "token": "fcm_token_here",
  "userId": "user_id_here"
}
```

---

## Profile API

### Get Profile
```http
GET /api/profile/{profileId}
```

### Update Profile Bio
```http
POST /api/profile/Bio
Content-Type: application/json

{
  "bio": "Biography content here..."
}
```

---

## Feedbacks API

### Get All Feedbacks
```http
GET /api/feedbacks
```

**Response (200):**
```json
{
  "feedbacks": [
    {
      "id": "clx123...",
      "name": "John Doe",
      "email": "john@example.com",
      "title": "Question about admission",
      "message": "How can I apply?",
      "type": "QUESTION",
      "isResolved": false,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Countries API

### Get Countries
```http
GET /api/country
```

**Response (200):**
```json
[
  { "id": 1, "name": "Australia", "code": "AUSTRALIA" },
  { "id": 2, "name": "Korea", "code": "KOREA" },
  { "id": 3, "name": "Canada", "code": "CANADA" }
]
```

---

## Name Schools API

```http
GET /api/nameSchools
```

---

## Error Responses

All APIs return error responses in this format:

```json
{
  "error": "Error message here"
}
```

With appropriate HTTP status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
