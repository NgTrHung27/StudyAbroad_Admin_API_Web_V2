import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/tokens";
import { NewPasswordSchema } from "@/types/auth";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const body = await req.json();

    const validatedFields = NewPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return responses.badRequest("Trường dữ liệu không hợp lệ");
    }

    const { password, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
      return responses.badRequest("Mật khẩu không trùng khớp");
    }

    const existingToken = await getPasswordResetTokenByToken(params.token);

    if (!existingToken) {
      return responses.notFound("Mã khôi phục không tồn tại");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return responses.badRequest("Mã khôi phục đã hết hạn");
    }

    const existingUser = await db.account.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return responses.notFound("Không tìm thấy người dùng");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.account.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return responses.ok(null, "Thay đổi mật khẩu thành công");
  } catch (error) {
    console.error("[NEW PASSWORD ERROR]", error);

    if (error instanceof SyntaxError) {
      return responses.badRequest("Định dạng JSON không hợp lệ");
    }

    return responses.serverError("Lỗi thay đổi mật khẩu");
  }
}
