import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export const revalidate = 0;

export async function GET() {
  try {
    const schools = await db.school.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return responses.ok(schools);
  } catch (error) {
    console.error("[GET NAME SCHOOLS ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin trường");
  }
}
