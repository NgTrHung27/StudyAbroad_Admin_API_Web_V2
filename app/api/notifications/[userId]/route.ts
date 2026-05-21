import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return responses.badRequest("Không tìm thấy mã người dùng");
    }

    const notifications = await db.notificationPush.findMany({
      where: {
        receiverId: params.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return responses.ok(notifications);
  } catch (error) {
    console.error("[GET NOTIFICATIONS ERROR]", error);
    return responses.serverError("Error getting notifications");
  }
}
