import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";
import { FeedbackSchema } from "@/types/auth";

export async function GET() {
  try {
    const feedbacks = await db.feedback.findMany({
      include: {
        school: {
          select: {
            id: true,
            name: true,
            logo: true,
            country: true,
          },
        },
      },
    });

    return responses.ok(feedbacks);
  } catch (error) {
    console.error("[GET FEEDBACKS ERROR]", error);
    return responses.serverError("Lấy dữ liệu phản hồi thất bại");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = FeedbackSchema.safeParse(body);

    if (!validatedFields.success) {
      return responses.badRequest("Trường dữ liệu không hợp lệ");
    }

    const { ...data } = validatedFields.data;

    if (data.schoolId) {
      const school = await db.school.findUnique({
        where: { id: data.schoolId },
      });

      if (!school) {
        return responses.notFound("Không tìm thấy trường học");
      }
    }

    const feedback = await db.feedback.create({
      data: {
        ...data,
        type: "FEEDBACK",
      },
    });

    return responses.created(feedback, "Tạo phản hồi thành công");
  } catch (error) {
    console.error("[CREATE FEEDBACK ERROR]", error);
    return responses.serverError("Tạo phản hồi thất bại");
  }
}
