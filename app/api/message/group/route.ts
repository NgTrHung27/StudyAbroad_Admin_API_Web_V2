import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return responses.badRequest("Vui lòng cung cấp groupId");
    }

    const messages = await db.message.findMany({
      where: { chatId: groupId },
      orderBy: { createAt: "asc" },
      include: {
        student: {
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

    return responses.ok(messages);
  } catch (error) {
    console.error("[GET GROUP MESSAGES ERROR]", error);
    return responses.serverError("Lỗi lấy tin nhắn nhóm");
  }
}
