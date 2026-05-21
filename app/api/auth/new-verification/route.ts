import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return responses.badRequest("Vui lòng truyền vào mã xác thực");
    }

    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return responses.notFound("Mã xác thực không tồn tại");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return responses.badRequest("Mã xác thực đã quá hạn");
    }

    const existingUser = await db.account.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return responses.notFound("Người dùng không tồn tại");
    }

    await db.account.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return responses.ok(null, "Xác thực email thành công");
  } catch (error) {
    console.error("[VERIFICATION EMAIL ERROR]", error);

    if (error instanceof SyntaxError) {
      return responses.badRequest("Định dạng JSON không hợp lệ");
    }

    return responses.serverError("Lỗi xác thực email");
  }
}
