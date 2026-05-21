import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export const revalidate = 0;

export async function GET() {
  try {
    const schools = await db.school.findMany({
      where: {
        isPublished: true,
      },
      include: {
        locations: {
          include: {
            contacts: true,
            images: true,
          },
        },
        programs: {
          include: {
            studentPrograms: {
              select: {
                student: {
                  select: {
                    id: true,
                    studentCode: true,
                    account: {
                      select: {
                        name: true,
                      },
                    },
                    cover: true,
                    degreeType: true,
                    certificateType: true,
                    gradeType: true,
                    gradeScore: true,
                    status: true,
                  },
                },
              },
            },
            images: true,
          },
        },
        galleries: {
          include: {
            images: true,
          },
        },
        scholarships: {
          include: {
            images: true,
            owners: {
              include: {
                student: true,
              },
            },
          },
        },
        news: true,
      },
    });

    return responses.ok(schools);
  } catch (error) {
    console.error("[GET SCHOOLS FULL ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin trường đầy đủ");
  }
}
