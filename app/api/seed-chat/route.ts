import { responses } from "@/lib/api-response";
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const { Client } = pg;

const dbUrl = process.env.DATABASE_URL;

async function safeInsert(client: pg.Client, query: string, params: any[] = []) {
  try {
    const result = await client.query(query, params);
    return { success: true, count: result.rowCount || 0 };
  } catch (error: any) {
    if (error.code === '23505') return { success: true, count: 0 };
    console.error(`  Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Seed Chat Data - Tạo dữ liệu chat để test
 */
export async function POST() {
  try {
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log("Connected to database");

    const adminAccount = await client.query(
      `SELECT id FROM "Account" WHERE email = 'admin@cemc.com' LIMIT 1`
    );
    const studentAccount = await client.query(
      `SELECT id, "id" FROM "Student" WHERE "accountId" = (SELECT id FROM "Account" WHERE email = 'student1@test.com' LIMIT 1) LIMIT 1`
    );

    if (adminAccount.rows.length === 0 || studentAccount.rows.length === 0) {
      await client.end();
      return responses.notFound("Vui lòng chạy /api/seed trước để tạo users");
    }

    const adminId = adminAccount.rows[0].id;
    const studentId = studentAccount.rows[0].id;

    await safeInsert(client, `
      INSERT INTO "ChatSupport" (id, "clientId", name, email, "userId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'client_admin_001', 'Admin Chat', 'admin@cemc.com', $1, NOW(), NOW())
      ON CONFLICT ("clientId") DO UPDATE SET "updatedAt" = NOW()
      RETURNING id, "clientId"
    `, [adminId]);

    await safeInsert(client, `
      INSERT INTO "ChatSupportMessage" (id, message, role, "chatSessionId", "createdAt", "updatedAt")
      SELECT 
        gen_random_uuid(),
        msg.message,
        msg.role::"ChatSupportRole",
        cs.id,
        NOW(),
        NOW()
      FROM (VALUES 
        ('Xin chào, tôi cần hỗ trợ về du học', 'USER'::text),
        ('Chào bạn, tôi sẽ hỗ trợ. Bạn cần giúp gì?', 'ADMIN'::text),
        ('Tôi muốn biết về học phí trường Australia', 'USER'::text),
        ('Học phí tùy theo trường và ngành học. Bạn quan tâm trường nào?', 'ADMIN'::text)
      ) AS msg(message, role)
      CROSS JOIN "ChatSupport" cs
      WHERE cs."clientId" = 'client_admin_001'
    `);

    const chatResult = await safeInsert(client, `
      INSERT INTO "Chat" (id, name, "creatAt", "updateAt")
      VALUES (gen_random_uuid(), 'Group Du Học Australia', NOW(), NOW())
      ON CONFLICT (name) DO UPDATE SET "updateAt" = NOW()
      RETURNING id
    `);

    const chatId = chatResult.success ? chatResult.error || '' : '';

    await safeInsert(client, `
      INSERT INTO "_ChatToStudent" ("A", "B")
      SELECT cs.id, s.id
      FROM "ChatSupport" cs
      CROSS JOIN "Student" s
      WHERE cs."userId" IS NOT NULL
      LIMIT 5
      ON CONFLICT DO NOTHING
    `);

    await client.end();

    return responses.created({
      success: true,
      credentials: {
        adminAccountId: adminId,
        studentId: studentId,
        clientId: "client_admin_001",
        chatId: chatId,
      },
      testEndpoints: {
        notifications: `/api/notifications/${adminId}`,
        chatSession: `/api/chat-session/client_admin_001/${adminId}`,
        messagePrivate: `/api/message/private?studentCode=STU001`,
        messageGroup: `/api/message/group?groupId=${chatId}`,
        profile: `/api/profile/Bio?profileId=<profileId>`,
      }
    }, "Chat data seeded successfully");
  } catch (error: any) {
    console.error("[SEED CHAT ERROR]", error);
    return responses.serverError(error.message);
  }
}
