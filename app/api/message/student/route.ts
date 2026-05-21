import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentCode = searchParams.get("studentCode");

    if (!studentCode) {
      return responses.badRequest("Vui lòng cung cấp studentCode");
    }

    const chats = await db.chat.findMany({
      where: {
        students: {
          some: {
            studentCode,
          },
        },
      },
      include: {
        messeges: {
          orderBy: { createAt: "desc" },
          take: 1,
        },
        students: {
          select: {
            id: true,
            studentCode: true,
            account: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return responses.ok(chats);
  } catch (error) {
    console.error("[GET STUDENT MESSAGES ERROR]", error);
    return responses.serverError("Lỗi lấy tin nhắn sinh viên");
  }
}
