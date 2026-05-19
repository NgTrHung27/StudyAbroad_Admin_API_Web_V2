import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    const accountCount = await db.account.count();
    const schoolCount = await db.school.count();
    
    // Get all accounts
    const accounts = await db.account.findMany({
      select: {
        email: true,
        password: true,
        emailVerified: true,
      },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      database: {
        accountCount,
        schoolCount,
      },
      accounts: accounts.map(a => ({
        email: a.email,
        hasPassword: !!a.password,
        passwordLength: a.password?.length || 0,
        emailVerified: !!a.emailVerified,
      })),
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
