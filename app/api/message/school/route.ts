import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return responses.badRequest("Vui lòng cung cấp schoolId");
    }

    const students = await db.student.findMany({
      where: { schoolId },
      select: {
        id: true,
        studentCode: true,
        chats: {
          select: {
            id: true,
            name: true,
            messeges: {
              orderBy: { createAt: "desc" },
              take: 1,
              select: {
                content: true,
                createAt: true,
              },
            },
          },
        },
        account: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return responses.ok(students);
  } catch (error) {
    console.error("[GET SCHOOL MESSAGES ERROR]", error);
    return responses.serverError("Lỗi lấy tin nhắn trường");
  }
}
