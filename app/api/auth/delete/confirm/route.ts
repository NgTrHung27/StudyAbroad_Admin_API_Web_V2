import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";
import { getDeleteAccountTokenByToken } from "@/lib/tokens";
import { deleteAccount } from "@/action/account";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return responses.badRequest("Vui lòng truyền vào mã xác thực");
    }

    const existingToken = await getDeleteAccountTokenByToken(token);

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
      return responses.notFound("Tài khoản không tồn tại hoặc đã được xóa trước đó");
    }

    // Delete the account and associated records
    const result = await deleteAccount(existingUser.id);

    if (result.error) {
      return responses.serverError(result.error);
    }

    // Delete the token
    await db.deleteAccountToken.delete({
      where: { id: existingToken.id },
    });

    return responses.ok(null, "Xóa tài khoản thành công");
  } catch (error) {
    console.error("[CONFIRM DELETE ACCOUNT ERROR]", error);

    if (error instanceof SyntaxError) {
      return responses.badRequest("Định dạng JSON không hợp lệ");
    }

    return responses.serverError("Lỗi xác nhận xóa tài khoản");
  }
}
