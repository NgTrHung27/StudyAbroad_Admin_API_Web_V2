import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentCode = searchParams.get("studentCode");

    if (!studentCode) {
      return responses.badRequest("Vui lòng cung cấp studentCode");
    }

    const messages = await db.message.findMany({
      where: { studentCode },
      orderBy: { createAt: "desc" },
      take: 50,
      include: {
        chat: {
          select: {
            id: true,
            name: true,
          },
        },
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
    console.error("[GET PRIVATE MESSAGES ERROR]", error);
    return responses.serverError("Lỗi lấy tin nhắn riêng tư");
  }
}
