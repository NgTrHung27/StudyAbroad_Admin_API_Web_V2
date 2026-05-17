# Deploy to Vercel

## 1. Chuẩn bị

### Clone repository
```bash
git clone https://github.com/your-repo/StudyAbroad_Admin_API_Web_V2.git
cd StudyAbroad_Admin_API_Web_V2
```

### Cài đặt dependencies
```bash
npm install
```

### Setup Environment Variables trên Vercel

Thêm các biến môi trường sau trong Vercel Dashboard (Settings > Environment Variables):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string từ Neon |
| `DIRECT_DATABASE_URL` | PostgreSQL direct connection string |
| `CLERK_SECRET_KEY` | Secret key từ Clerk Dashboard |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key từ Clerk |
| `UPSTASH_REDIS_REST_URL` | Redis URL từ Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Redis Token |
| `EDGE_STORE_ACCESS_KEY` | Edge Store access key |
| `EDGE_STORE_SECRET_KEY` | Edge Store secret key |
| `ABLY_API_KEY` | Ably API key |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase service account JSON |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

## 2. Deploy

### Cách 1: Deploy qua GitHub (Khuyến nghị)

1. Push code lên GitHub repository
2. Vào [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import GitHub repository
5. Add Environment Variables
6. Click "Deploy"

### Cách 2: Deploy qua CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 3. Sau khi Deploy

### Rebuild Database Schema
Sau khi deploy, chạy command để sync schema:

```bash
npx prisma db push
```

### Seed Database (tùy chọn)
```bash
npm run db:seed
```

## 4. URLs

- **Admin Dashboard**: https://your-project.vercel.app
- **API Base**: https://your-project.vercel.app/api

## 5. Test API

Import `API_TEST_DATA.json` vào Postman hoặc sử dụng curl:

```bash
# Test Schools API
curl https://your-project.vercel.app/api/schools

# Test News API  
curl https://your-project.vercel.app/api/news

# Test Countries API
curl https://your-project.vercel.app/api/country
```

## Troubleshooting

### Lỗi "Connection refused"
- Kiểm tra DATABASE_URL đã đúng chưa
- Kiểm tra Neon database có active không

### Lỗi "Prisma Client not found"
```bash
npx prisma generate
npm run build
```

### Lỗi Clerk Keys
- Kiểm tra Clerk keys có đúng environment (development vs production)
- Development keys bắt đầu với `pk_test_` và `sk_test_`
- Production keys bắt đầu với `pk_live_` và `sk_live_`
