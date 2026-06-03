import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

type RouteParams = {
  params: { schoolId: string; scholarshipId: string };
};

/**
 * GET /api/schools/[schoolId]/scholarships/[scholarshipId]
 * Lấy thông tin chi tiết 1 học bổng của trường
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { schoolId, scholarshipId } = params;

    if (!schoolId || !scholarshipId) {
      return responses.badRequest("Vui lòng cung cấp schoolId và scholarshipId");
    }

    const scholarship = await db.schoolScholarship.findUnique({
      where: { id: scholarshipId },
      include: {
        images: true,
        school: {
          select: { id: true, name: true, logo: true, color: true },
        },
        owners: {
          include: {
            student: {
              select: {
                id: true,
                studentCode: true,
                status: true,
                account: {
                  select: { name: true, image: true },
                },
              },
            },
          },
        },
      },
    });

    if (!scholarship || scholarship.schoolId !== schoolId) {
      return responses.notFound("Không tìm thấy học bổng");
    }

    return responses.ok(scholarship);
  } catch (error) {
    console.error("[GET SCHOLARSHIP ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin học bổng");
  }
}

/**
 * POST /api/schools/[schoolId]/scholarships/[scholarshipId]
 * Apply học bổng cho học sinh
 * Body: { studentId: string; additional?: string }
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { schoolId, scholarshipId } = params;
    const body = await req.json();
    const { studentId, additional } = body;

    if (!schoolId || !scholarshipId) {
      return responses.badRequest("Vui lòng cung cấp schoolId và scholarshipId");
    }

    if (!studentId) {
      return responses.badRequest("Vui lòng cung cấp studentId");
    }

    // Kiểm tra học bổng tồn tại và thuộc trường
    const scholarship = await db.schoolScholarship.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship || scholarship.schoolId !== schoolId) {
      return responses.notFound("Không tìm thấy học bổng");
    }

    if (!scholarship.isPublished) {
      return responses.badRequest("Học bổng này hiện không mở đăng ký");
    }

    // Kiểm tra học sinh tồn tại
    const student = await db.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return responses.notFound("Không tìm thấy học sinh");
    }

    // Kiểm tra học sinh có thuộc trường không
    if (student.schoolId !== schoolId) {
      return responses.badRequest("Học sinh không thuộc trường này");
    }

    // Kiểm tra học sinh đã apply học bổng này chưa
    const existingApplication = await db.studentSchoolScholarship.findFirst({
      where: {
        studentId,
        scholarshipId,
      },
    });

    if (existingApplication) {
      return responses.conflict("Học sinh đã đăng ký học bổng này rồi");
    }

    // Cập nhật thông tin additional nếu có
    if (additional) {
      await db.student.update({
        where: { id: studentId },
        data: { additional },
      });
    }

    // Tạo bản ghi apply học bổng
    const application = await db.studentSchoolScholarship.create({
      data: {
        studentId,
        scholarshipId,
      },
      include: {
        student: {
          select: {
            id: true,
            studentCode: true,
            account: { select: { name: true, email: true } },
          },
        },
        scholarship: {
          select: { id: true, name: true },
        },
      },
    });

    return responses.created(application, "Đăng ký học bổng thành công");
  } catch (error: any) {
    console.error("[APPLY SCHOLARSHIP ERROR]", error);

    // Handle unique constraint violation
    if (error?.code === "P2002") {
      return responses.conflict("Học sinh đã đăng ký học bổng này rồi");
    }

    return responses.serverError("Lỗi đăng ký học bổng");
  }
}

/**
 * DELETE /api/schools/[schoolId]/scholarships/[scholarshipId]
 * Hủy đăng ký học bổng
 * Body: { studentId: string }
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { schoolId, scholarshipId } = params;
    const body = await req.json();
    const { studentId } = body;

    if (!studentId) {
      return responses.badRequest("Vui lòng cung cấp studentId");
    }

    const application = await db.studentSchoolScholarship.findFirst({
      where: { studentId, scholarshipId },
    });

    if (!application) {
      return responses.notFound("Không tìm thấy đăng ký học bổng");
    }

    await db.studentSchoolScholarship.delete({
      where: { id: application.id },
    });

    return responses.ok(null, "Hủy đăng ký học bổng thành công");
  } catch (error) {
    console.error("[CANCEL SCHOLARSHIP ERROR]", error);
    return responses.serverError("Lỗi hủy đăng ký học bổng");
  }
}
