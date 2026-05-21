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
    return { success: false, count: 0 };
  }
}

export async function POST() {
  try {
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log("Connected to database");

    const hashedPassword = await bcrypt.hash("Test123456", 12);

    const result = await safeInsert(client, `
      INSERT INTO "Account" (
        id, email, "emailVerified", password, name, dob, gender, 
        "phoneNumber", "idCardNumber", address, image, "isLocked", 
        "isTwoFactorEnabled", "createdAt", "updatedAt"
      ) VALUES 
        (gen_random_uuid(), 'admin@cemc.com', NOW(), $1, 'Admin CEMC', '1990-01-15', 'MALE', 
         '0909123456', '123456789012', '123 Admin Street', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', false, false, NOW(), NOW()),
        (gen_random_uuid(), 'student1@test.com', NOW(), $1, 'Nguyen Van A', '2005-06-20', 'MALE', 
         '0909123457', '123456789013', '456 Student Ave', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', false, false, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, [hashedPassword]);

    await client.end();

    return responses.created({
      success: true,
      credentials: {
        admin: 'admin@cemc.com / Test123456',
        student: 'student1@test.com / Test123456'
      }
    }, `Created ${result.count} accounts`);
  } catch (error: any) {
    console.error("[SEED ERROR]", error);
    return responses.serverError(error.message);
  }
}
