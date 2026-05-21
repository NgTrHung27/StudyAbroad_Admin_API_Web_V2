import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const schools = await db.school.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        country: true,
        logo: true,
        short: true,
        background: true,
        locations: {
          select: {
            name: true,
            images: {
              select: {
                url: true,
              },
            },
            isMain: true,
            cover: true,
            description: true,
          },
        },
        programs: {
          select: {
            name: true,
            images: {
              select: {
                url: true,
              },
            },
            cover: true,
            description: true,
          },
        },
      },
    });

    return responses.ok({ schools });
  } catch (error) {
    console.error("[GET SCHOOLS API ERROR]", error);
    return responses.serverError("Lỗi lấy danh sách trường học");
  }
}
