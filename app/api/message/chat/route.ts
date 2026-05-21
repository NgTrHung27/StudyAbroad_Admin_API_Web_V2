import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return responses.badRequest("Vui lòng cung cấp chatId");
    }

    const messages = await db.message.findMany({
      where: { chatId },
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
    console.error("[GET MESSAGES ERROR]", error);
    return responses.serverError("Lỗi lấy tin nhắn");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatId, studentCode, content } = body;

    if (!chatId || !studentCode || !content) {
      return responses.badRequest("Thiếu thông tin cần thiết: chatId, studentCode, content");
    }

    const message = await db.message.create({
      data: {
        chatId,
        studentCode,
        content,
      },
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

    return responses.created(message, "Gửi tin nhắn thành công");
  } catch (error) {
    console.error("[SEND MESSAGE ERROR]", error);
    return responses.serverError("Lỗi gửi tin nhắn");
  }
}
