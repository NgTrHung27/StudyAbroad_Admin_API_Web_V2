import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * API để lấy các ID từ accountId
 * 
 * Cách dùng:
 * GET /api/accounts/{accountId}
 * 
 * Response:
 * {
 *   accountId,    → Dùng cho /api/notifications/{accountId}
 *   studentId,     → Dùng cho message APIs (studentCode)
 *   profileId,     → Dùng cho /api/profile/{profileId}
 *   studentCode,   → Dùng cho /api/message/student?studentCode=x
 * }
 */
export async function GET(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;

    if (!accountId) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp accountId" },
        { status: 400 }
      );
    }

    const account = await db.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        email: true,
        name: true,
        student: {
          select: {
            id: true,
            studentCode: true,
            schoolId: true,
            profile: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      accountId: account.id,
      email: account.email,
      name: account.name,
      studentId: account.student?.id || null,
      studentCode: account.student?.studentCode || null,
      profileId: account.student?.profile?.id || null,
      schoolId: account.student?.schoolId || null,
    });
  } catch (error) {
    console.error("Error getting account info:", error);
    return NextResponse.json(
      { error: "Lỗi lấy thông tin tài khoản" },
      { status: 500 }
    );
  }
}
