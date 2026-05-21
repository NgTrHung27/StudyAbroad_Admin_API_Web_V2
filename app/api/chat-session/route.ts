import { responses } from "@/lib/api-response";
import { ChatSupportSchema } from "@/data/form-schema";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { ChatSessionRole } from "@prisma/client";

export async function POST(req: Request) {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return NextResponse.json(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const body = await req.json();

    const validatedValues = ChatSupportSchema.safeParse(body);

    if (!validatedValues.success) {
      return responses.badRequest(validatedValues.error.message);
    }

    const { message, ...data } = validatedValues.data;

    if (data.userId) {
      const user = await db.account.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        return responses.notFound("Người dùng không tồn tại");
      }

      const existChatSession = await db.chatSession.findFirst({
        where: { userId: data.userId },
      });

      if (existChatSession) {
        if (data.clientId && data.clientId !== existChatSession.clientId) {
          await db.chatSession.update({
            where: { id: existChatSession.id },
            data: { ...data, clientId: data.clientId },
          });
        }

        await db.chatSessionMessage.create({
          data: {
            message,
            role: ChatSessionRole.USER,
            chatSessionId: existChatSession.id,
          },
        });

        return responses.ok({ sessionId: existChatSession.id }, "Gửi tin nhắn thành công");
      } else {
        await db.chatSession.create({
          data: {
            ...data,
            messages: {
              create: [{ message, role: ChatSessionRole.USER }],
            },
            userId: data.userId,
            clientId: uuid(),
          },
        });

        return responses.created(null, "Tạo phiên chat thành công");
      }
    }

    if (data.clientId && !data.userId) {
      const existChatSession = await db.chatSession.findFirst({
        where: { clientId: data.clientId },
      });

      if (existChatSession) {
        await db.chatSessionMessage.create({
          data: {
            message,
            role: ChatSessionRole.USER,
            chatSessionId: existChatSession.id,
          },
        });

        return responses.ok({ sessionId: existChatSession.id }, "Gửi tin nhắn thành công");
      } else {
        await db.chatSession.create({
          data: {
            ...data,
            clientId: data.clientId,
            messages: {
              create: [{ message, role: ChatSessionRole.USER }],
            },
          },
        });

        return responses.created(null, "Tạo phiên chat thành công");
      }
    }

    return responses.badRequest("Không thể lưu trữ phiên chat do không tìm thấy mã máy khách");
  } catch (error) {
    console.error("[CREATE CHAT SESSION ERROR]", error);
    return responses.serverError("Lỗi tạo phiên chat");
  }
}
