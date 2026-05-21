import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { clientId: string; accountId: string } }
) {
  try {
    if (!params.clientId && !params.accountId) {
      return responses.notFound("Thiếu thông tin phiên chat");
    }

    const chatSession = await db.chatSession.findFirst({
      where: {
        OR: [
          { clientId: params.clientId },
          { userId: params.accountId },
        ],
      },
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!chatSession) {
      return responses.notFound("Không tìm thấy phiên chat");
    }

    return responses.ok(chatSession);
  } catch (error) {
    console.error("[GET CHAT SESSION ERROR]", error);
    return responses.serverError("Lỗi không xác định");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { clientId: string; accountId: string } }
) {
  try {
    if (!params.clientId && !params.accountId) {
      return responses.notFound("Thiếu thông tin phiên chat");
    }

    const chatSession = await db.chatSession.findFirst({
      where: {
        OR: [
          { clientId: params.clientId },
          { userId: params.accountId },
        ],
      },
    });

    if (!chatSession) {
      return responses.notFound("Không tìm thấy phiên chat");
    }

    await db.chatSessionMessage.deleteMany({
      where: { chatSessionId: chatSession.id },
    });

    return responses.ok(null, "Xóa phiên chat thành công");
  } catch (error) {
    console.error("[DELETE CHAT SESSION ERROR]", error);
    return responses.serverError("Lỗi không xác định");
  }
}
