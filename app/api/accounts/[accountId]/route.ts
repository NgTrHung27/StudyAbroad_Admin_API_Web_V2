import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

/**
 * API để lấy các ID từ accountId
 * 
 * Cách dùng:
 * GET /api/accounts/{accountId}
 * 
 * Response:
 * {
 *   "statusCode": 200,
 *   "message": "Success",
 *   "data": {
 *     accountId,    → Dùng cho /api/notifications/{accountId}
 *     studentId,     → Dùng cho message APIs (studentCode)
 *     profileId,     → Dùng cho /api/profile/{profileId}
 *     studentCode,   → Dùng cho /api/message/student?studentCode=x
 *   }
 * }
 */
export async function GET(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;

    if (!accountId) {
      return responses.badRequest("Vui lòng cung cấp accountId");
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
      return responses.notFound("Không tìm thấy tài khoản");
    }

    return responses.ok({
      accountId: account.id,
      email: account.email,
      name: account.name,
      studentId: account.student?.id || null,
      studentCode: account.student?.studentCode || null,
      profileId: account.student?.profile?.id || null,
      schoolId: account.student?.schoolId || null,
    });
  } catch (error) {
    console.error("[GET ACCOUNT ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin tài khoản");
  }
}
