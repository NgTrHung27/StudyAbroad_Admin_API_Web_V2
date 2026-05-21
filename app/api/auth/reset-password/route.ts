import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = ResetSchema.safeParse(body);

    if (!validatedFields.success) {
      return responses.badRequest("Trường dữ liệu không hợp lệ");
    }

    const { email } = validatedFields.data;

    const existingUser = await db.account.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return responses.unauthorized("Không tồn tại người dùng");
    }

    const passwordResetToken = await generatePasswordResetToken(existingUser.email);

    await sendPasswordResetEmail(
      existingUser.name,
      passwordResetToken.email,
      passwordResetToken.token
    );

    return responses.ok(null, "Gửi email khôi phục mật khẩu thành công");
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);

    if (error instanceof SyntaxError) {
      return responses.badRequest("Định dạng JSON không hợp lệ");
    }

    return responses.serverError("Lỗi gửi email khôi phục mật khẩu");
  }
}
