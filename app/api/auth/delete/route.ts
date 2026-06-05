import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";
import { DeleteSchema } from "@/types/auth";
import bcrypt from "bcryptjs";
import { generateDeleteAccountToken } from "@/lib/tokens";
import { sendDeleteAccountEmail } from "@/lib/email";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = DeleteSchema.safeParse(body);

    if (!validatedFields.success) {
      return responses.badRequest("Trường dữ liệu không hợp lệ");
    }

    const data = validatedFields.data;

    const existingAccount = await db.account.findUnique({
      where: { email: data.email },
    });

    if (!existingAccount) {
      return responses.notFound("Tài khoản không tồn tại");
    }

    if (data.password) {
      const isPasswordMatch = await bcrypt.compare(data.password, existingAccount.password);

      if (!isPasswordMatch) {
        return responses.forbidden("Thông tin tài khoản không chính xác");
      }
    }

    const deleteAccountToken = await generateDeleteAccountToken(existingAccount.email);

    await sendDeleteAccountEmail(
      existingAccount.name,
      existingAccount.email,
      deleteAccountToken.token
    );

    return responses.ok(null, "Gửi email xác nhận xóa tài khoản thành công");
  } catch (error) {
    console.error("[DELETE ACCOUNT ERROR]", error);
    return responses.serverError("Có lỗi xảy ra, vui lòng thử lại sau");
  }
}
