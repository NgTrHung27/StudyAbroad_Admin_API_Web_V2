# CEMC Study Abroad Admin API Documentation

## Base URL
```
Production: https://study-abroad-cemc-admin.vercel.app
Development: http://localhost:3000
```

## Standard Response Format

Tất cả API responses đều tuân theo format chuẩn:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

### Status Codes
| Code | Mô tả |
|------|--------|
| 200 | Thành công (OK) |
| 201 | Tạo mới thành công (Created) |
| 400 | Yêu cầu không hợp lệ (Bad Request) |
| 401 | Không có quyền truy cập (Unauthorized) |
| 403 | Tài khoản bị cấm (Forbidden) |
| 404 | Không tìm thấy (Not Found) |
| 409 | Dữ liệu đã tồn tại (Conflict) |
| 500 | Lỗi server (Internal Server Error) |

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "errors": { ... }
}
```

---

## Authentication APIs

### 1. Login
```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "admin@cemc.com",
  "password": "Test123456"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "uuid",
    "email": "admin@cemc.com",
    "name": "Admin CEMC",
    "image": "https://...",
    "emailVerified": "2024-01-15T00:00:00.000Z",
    "phoneNumber": "0909123456",
    "address": "123 Admin Street",
    "isLocked": false,
    "student": {
      "id": "uuid",
      "studentCode": "STU001",
      "status": "APPROVED",
      "profile": {
        "id": "uuid"
      }
    }
  }
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Không tồn tại người dùng"
}
```

---

### 2. Register
```
POST /api/auth/register
```

**Body:**
```json
{
  "email": "student@test.com",
  "password": "Test123456",
  "confirmPassword": "Test123456",
  "name": "Nguyen Van A",
  "gender": "MALE",
  "dob": "2005-06-20",
  "phoneNumber": "0909123457",
  "idCardNumber": "123456789013",
  "addressLine": "456 Student Ave",
  "city": "Ho Chi Minh City",
  "district": "District 1",
  "ward": "Ward 1",
  "schoolName": "University of Sydney",
  "programName": "Computer Science",
  "degreeType": "HIGHSCHOOL",
  "certificateType": "IELTS",
  "gradeType": "GPA",
  "gradeScore": "8.5"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Đăng ký thành công, vui lòng check hòm thư email để xác thực người dùng",
  "data": {
    "account": {
      "id": "uuid",
      "email": "student@test.com",
      "name": "Nguyen Van A"
    }
  }
}
```

---

### 3. Email Verification
```
POST /api/auth/new-verification
```

**Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Xác thực email thành công",
  "data": null
}
```

---

### 4. Reset Password
```
POST /api/auth/reset-password
```

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Gửi email khôi phục mật khẩu thành công",
  "data": null
}
```

---

### 5. New Password
```
POST /api/auth/new-password/{token}
```

**Body:**
```json
{
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thay đổi mật khẩu thành công",
  "data": null
}
```

---

### 6. Delete Account
```
DELETE /api/auth/delete
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "UserPassword123"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Gửi email xác nhận xóa tài khoản thành công",
  "data": null
}
```

---

## Schools APIs

### 1. Get All Schools
```
GET /api/schools
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "name": "University of Sydney",
      "logo": "https://...",
      "background": "https://...",
      "short": "USYD",
      "programs": [
        { "name": "Computer Science" }
      ]
    }
  ]
}
```

---

### 2. Get School Full Info
```
GET /api/schools/full
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "name": "University of Sydney",
      "logo": "https://...",
      "country": "Australia",
      "locations": [
        {
          "name": "Main Campus",
          "description": "...",
          "images": [{ "url": "https://..." }]
        }
      ],
      "programs": [
        {
          "name": "Computer Science",
          "description": "...",
          "images": [{ "url": "https://..." }],
          "studentPrograms": [
            {
              "student": {
                "studentCode": "STU001",
                "account": { "name": "Student Name" },
                "status": "APPROVED"
              }
            }
          ]
        }
      ],
      "scholarships": [
        {
          "name": "Merit Scholarship",
          "images": [{ "url": "https://..." }]
        }
      ],
      "news": [
        { "title": "News Title", "content": "..." }
      ]
    }
  ]
}
```

---

### 3. Get School by ID
```
GET /api/schools/{schoolId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "uuid",
    "name": "University of Sydney",
    "logo": "https://...",
    "country": "Australia",
    "short": "USYD",
    "background": "https://..."
  }
}
```

---

### 4. Get School Names
```
GET /api/nameSchools
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "name": "University of Sydney"
    },
    {
      "id": "uuid",
      "name": "University of Melbourne"
    }
  ]
}
```

---

### 5. Get Schools (Auth)
```
GET /api/auth/schools
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "schools": [
      {
        "id": "uuid",
        "name": "University of Sydney",
        "country": "Australia",
        "logo": "https://...",
        "short": "USYD",
        "background": "https://...",
        "locations": [...],
        "programs": [...]
      }
    ]
  }
}
```

---

## Profile APIs

### 1. Get Account Info (All IDs)
```
GET /api/accounts/{accountId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "accountId": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "studentId": "uuid",
    "studentCode": "STU001",
    "profileId": "uuid",
    "schoolId": "uuid"
  }
}
```

---

### 2. Get Profile by ID
```
GET /api/profile/{profileId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "uuid",
    "biography": {
      "id": "uuid",
      "content": "Biography text..."
    },
    "student": {
      "account": {
        "id": "uuid",
        "image": "https://...",
        "address": "Address",
        "phoneNumber": "0909123456"
      }
    }
  }
}
```

---

### 3. Get Profile Bio
```
GET /api/profile/Bio?profileId={profileId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "uuid",
    "biography": {
      "id": "uuid",
      "content": "Biography...",
      "areas": [
        {
          "area": {
            "id": "uuid",
            "title": "Area Title"
          }
        }
      ],
      "socials": [
        {
          "id": "uuid",
          "type": "facebook",
          "href": "https://facebook.com/..."
        }
      ]
    }
  }
}
```

---

## News APIs

### 1. Get All News
```
GET /api/news
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "title": "News Title",
      "content": "News content...",
      "school": {
        "name": "University of Sydney"
      }
    }
  ]
}
```

---

### 2. Get News by ID
```
GET /api/news/{newsId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "uuid",
    "title": "News Title",
    "content": "News content...",
    "school": {
      "name": "University of Sydney"
    }
  }
}
```

---

## Feedback APIs

### 1. Get All Feedbacks
```
GET /api/feedbacks
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "content": "Feedback content...",
      "type": "FEEDBACK",
      "school": {
        "id": "uuid",
        "name": "School Name",
        "logo": "https://...",
        "country": "Australia"
      }
    }
  ]
}
```

---

### 2. Create Feedback
```
POST /api/feedbacks
```

**Body:**
```json
{
  "content": "Feedback content",
  "schoolId": "school_uuid"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Tạo phản hồi thành công",
  "data": {
    "id": "uuid",
    "content": "Feedback content",
    "type": "FEEDBACK"
  }
}
```

---

## Notifications APIs

### 1. Get Notifications by Account ID
```
GET /api/notifications/{accountId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "receiverId": "uuid",
      "title": "Notification Title",
      "body": "Notification body...",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Send Notification Token
```
POST /api/notifications
```

**Body:**
```json
{
  "userId": "uuid",
  "token": "fcm_token"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Cập nhật token thông báo thành công",
  "data": null
}
```

---

## Chat Support APIs

### 1. Create Chat Session
```
POST /api/chat-session
```

**Body:**
```json
{
  "clientId": "device_unique_id",
  "userId": "account_uuid",
  "name": "User Name",
  "email": "user@example.com",
  "phone": "0909123456",
  "message": "Hello, I need help"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Tạo phiên chat thành công",
  "data": null
}
```

---

### 2. Get Chat Session
```
GET /api/chat-session/{clientId}/{accountId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "uuid",
    "clientId": "device_unique_id",
    "userId": "account_uuid",
    "name": "User Name",
    "email": "user@example.com",
    "messages": [
      {
        "id": "uuid",
        "message": "Hello",
        "role": "USER",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### 3. Delete Chat Session
```
DELETE /api/chat-session/{clientId}/{accountId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Xóa phiên chat thành công",
  "data": null
}
```

---

## Message APIs

### 1. Get Messages by Chat ID
```
GET /api/message/chat?chatId={chatId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "content": "Message content",
      "createAt": "2024-01-15T00:00:00.000Z",
      "student": {
        "id": "uuid",
        "studentCode": "STU001",
        "account": {
          "name": "User Name",
          "image": "https://..."
        }
      }
    }
  ]
}
```

---

### 2. Send Message
```
POST /api/message/chat
```

**Body:**
```json
{
  "chatId": "chat_uuid",
  "studentCode": "STU001",
  "content": "Hello, this is a message"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Gửi tin nhắn thành công",
  "data": {
    "id": "uuid",
    "content": "Hello, this is a message",
    "createAt": "2024-01-15T00:00:00.000Z",
    "student": {
      "id": "uuid",
      "studentCode": "STU001",
      "account": {
        "name": "User Name",
        "image": "https://..."
      }
    }
  }
}
```

---

### 3. Get Private Messages
```
GET /api/message/private?studentCode={studentCode}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "content": "Message content",
      "studentCode": "STU001",
      "chat": {
        "id": "chat_uuid",
        "name": "Group Chat"
      },
      "student": {
        "studentCode": "STU001",
        "account": {
          "name": "User Name",
          "image": "https://..."
        }
      }
    }
  ]
}
```

---

### 4. Get Group Messages
```
GET /api/message/group?groupId={chatId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "content": "Group message",
      "student": {
        "studentCode": "STU001",
        "account": {
          "name": "User Name",
          "image": "https://..."
        }
      }
    }
  ]
}
```

---

### 5. Get School Messages
```
GET /api/message/school?schoolId={schoolId}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "uuid",
      "studentCode": "STU001",
      "account": {
        "name": "User Name",
        "image": "https://..."
      },
      "chats": [
        {
          "id": "chat_uuid",
          "name": "Group Chat",
          "messeges": [
            {
              "content": "Last message",
              "createAt": "2024-01-15T00:00:00.000Z"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 6. Get Student Messages
```
GET /api/message/student?studentCode={studentCode}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "id": "chat_uuid",
      "name": "Group Chat",
      "messeges": [
        {
          "content": "Last message",
          "createAt": "2024-01-15T00:00:00.000Z"
        }
      ],
      "students": [
        {
          "studentCode": "STU001",
          "account": {
            "name": "User Name",
            "image": "https://..."
          }
        }
      ]
    }
  ]
}
```

---

## Country APIs

### 1. Get All Countries
```
GET /api/country
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "code": "AU",
      "name": "Australia",
      "flag": "🇦🇺"
    },
    {
      "code": "US",
      "name": "United States",
      "flag": "🇺🇸"
    }
  ]
}
```

---

## Check Database (Development)

### 1. Check Database Connection
```
GET /api/check-db
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Database connected successfully",
  "data": {
    "schools": [
      { "id": "uuid", "name": "School Name", "country": "Australia" }
    ],
    "programs": [
      { "id": "uuid", "name": "Program Name", "schoolId": "uuid" }
    ]
  }
}
```

---

## Seed APIs (Development Only)

### 1. Seed Users
```
POST /api/seed
```

**Success Response:**
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "success": true,
    "message": "Created 2 accounts",
    "credentials": {
      "admin": "admin@cemc.com / Test123456",
      "student": "student1@test.com / Test123456"
    }
  }
}
```

---

### 2. Seed Chat Data
```
POST /api/seed-chat
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Chat data seeded successfully",
  "data": {
    "success": true,
    "credentials": {
      "adminAccountId": "uuid",
      "studentId": "uuid",
      "clientId": "client_admin_001",
      "chatId": "uuid"
    },
    "testEndpoints": {
      "notifications": "/api/notifications/{adminAccountId}",
      "chatSession": "/api/chat-session/client_admin_001/{adminAccountId}",
      "messagePrivate": "/api/message/private?studentCode=STU001",
      "messageGroup": "/api/message/group?groupId={chatId}"
    }
  }
}
```

---

## Seed Data Credentials

Sau khi chạy `/api/seed`, bạn có thể login với:

| Email | Password |
|-------|----------|
| admin@cemc.com | Test123456 |
| student1@test.com | Test123456 |

---

## Testing Flow

1. **Seed data:**
```bash
curl -X POST https://study-abroad-cemc-admin.vercel.app/api/seed
```

2. **Login để lấy accountId:**
```bash
curl -X POST https://study-abroad-cemc-admin.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cemc.com","password":"Test123456"}'
```

3. **Lấy thông tin tài khoản (profileId, studentCode):**
```bash
curl https://study-abroad-cemc-admin.vercel.app/api/accounts/{accountId_from_login}
```

4. **Test các APIs khác sử dụng các IDs đã lấy được.**
