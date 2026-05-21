import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { newsId: string } }
) {
  try {
    if (!params.newsId) {
      return responses.badRequest("Vui lòng cung cấp mã ID của tin tức");
    }

    const existingNews = await db.news.findUnique({
      where: {
        id: params.newsId,
      },
      include: {
        school: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingNews) {
      return responses.notFound("Không tìm thấy tin tức với ID cung cấp");
    }

    return responses.ok(existingNews);
  } catch (error) {
    console.error("[GET NEWS BY ID ERROR]", error);
    return responses.serverError("Lỗi lấy tin tức theo id");
  }
}
