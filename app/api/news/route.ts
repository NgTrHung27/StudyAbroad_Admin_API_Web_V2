import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export const revalidate = 0;

export async function GET() {
  try {
    const news = await db.news.findMany({
      where: {
        isPublished: true,
      },
      include: {
        school: {
          select: {
            name: true,
          },
        },
      },
    });

    return responses.ok(news);
  } catch (error) {
    console.error("[GET NEWS ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin tin tức");
  }
}
