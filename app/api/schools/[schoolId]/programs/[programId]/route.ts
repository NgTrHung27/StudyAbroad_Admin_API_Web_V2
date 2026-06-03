import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

type RouteParams = {
  params: { schoolId: string; programId: string };
};

/**
 * GET /api/schools/[schoolId]/programs/[programId]
 * Lấy thông tin chi tiết 1 ngành học của trường
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { schoolId, programId } = params;

    if (!schoolId || !programId) {
      return responses.badRequest("Vui lòng cung cấp schoolId và programId");
    }

    const program = await db.schoolProgram.findUnique({
      where: { id: programId },
      include: {
        images: true,
        school: {
          select: { id: true, name: true, logo: true, color: true },
        },
        studentPrograms: {
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

    if (!program || program.schoolId !== schoolId) {
      return responses.notFound("Không tìm thấy ngành học");
    }

    return responses.ok(program);
  } catch (error) {
    console.error("[GET PROGRAM ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin ngành học");
  }
}

/**
 * POST /api/schools/[schoolId]/programs/[programId]
 * Đăng ký ngành học cho học sinh
 * Body: { studentId: string; additional?: string }
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { schoolId, programId } = params;
    const body = await req.json();
    const { studentId, additional } = body;

    if (!schoolId || !programId) {
      return responses.badRequest("Vui lòng cung cấp schoolId và programId");
    }

    if (!studentId) {
      return responses.badRequest("Vui lòng cung cấp studentId");
    }

    // Kiểm tra ngành học tồn tại và thuộc trường
    const program = await db.schoolProgram.findUnique({
      where: { id: programId },
    });

    if (!program || program.schoolId !== schoolId) {
      return responses.notFound("Không tìm thấy ngành học");
    }

    if (!program.isPublished) {
      return responses.badRequest("Ngành học này hiện không mở đăng ký");
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

    // Kiểm tra học sinh đã đăng ký ngành này chưa
    const existingEnrollment = await db.studentSchoolProgram.findFirst({
      where: { studentId, programId },
    });

    if (existingEnrollment) {
      return responses.conflict("Học sinh đã đăng ký ngành học này rồi");
    }

    // Cập nhật thông tin additional nếu có
    if (additional) {
      await db.student.update({
        where: { id: studentId },
        data: { additional },
      });
    }

    // Tạo bản ghi đăng ký ngành học (mỗi student chỉ có 1 program - unique constraint)
    const enrollment = await db.studentSchoolProgram.create({
      data: {
        studentId,
        programId,
      },
      include: {
        student: {
          select: {
            id: true,
            studentCode: true,
            account: { select: { name: true, email: true } },
          },
        },
        program: {
          select: { id: true, name: true },
        },
      },
    });

    return responses.created(enrollment, "Đăng ký ngành học thành công");
  } catch (error: any) {
    console.error("[ENROLL PROGRAM ERROR]", error);

    if (error?.code === "P2002") {
      return responses.conflict("Học sinh đã đăng ký ngành học này rồi");
    }

    return responses.serverError("Lỗi đăng ký ngành học");
  }
}
