import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";
import { GetSchoolsByIdApi } from "@/lib/schools";

export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    if (!params.schoolId) {
      return responses.badRequest("Vui lòng cung cấp mã ID của trường");
    }

    const existingSchool = await GetSchoolsByIdApi(params.schoolId);

    if (!existingSchool) {
      return responses.notFound("Không tìm thấy trường với ID cung cấp");
    }

    const school = await db.school.findUnique({
      where: {
        id: params.schoolId,
      },
    });

    return responses.ok(school);
  } catch (error) {
    console.error("[GET SCHOOL BY ID ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin trường theo ID");
  }
}
