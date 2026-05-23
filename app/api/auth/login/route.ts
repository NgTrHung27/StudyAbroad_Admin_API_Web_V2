import { responses } from "@/lib/api-response";
import { GetAccountByEmail } from "@/lib/account";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/tokens";
import { LoginSchema } from "@/types/auth";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return responses.badRequest("Trường dữ liệu không hợp lệ");
    }

    const { email, password } = validatedFields.data;

    const existingAccount = await GetAccountByEmail(email!);

    if (!existingAccount) {
      return responses.unauthorized("Không tồn tại người dùng");
    }

    if (existingAccount.isLocked) {
      return responses.forbidden("Tài khoản của bạn đã bị khóa");
    }

    const isPasswordMatch = await bcrypt.compare(password, existingAccount.password);

    if (!isPasswordMatch) {
      return responses.forbidden("Thông tin tài khoản không chính xác");
    }

    if (!existingAccount.emailVerified) {
      const verificationToken = await generateVerificationToken(existingAccount.email);

      await sendVerificationEmail(
        existingAccount.name,
        process.env.NODE_SENDER_EMAIL || "noreply@example.com",
        verificationToken.email,
        verificationToken.token
      );

      return responses.forbidden("Email chưa xác thực, vui lòng kiểm tra hộp thư để được xác thực");
    }

    const tokenPayload = {
      accountId: existingAccount.id,
      email: existingAccount.email,
    };

    const token = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    return responses.created({
      token,
      refreshToken,
    }, "Success");
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return responses.serverError("Đăng nhập thất bại");
  }
}
