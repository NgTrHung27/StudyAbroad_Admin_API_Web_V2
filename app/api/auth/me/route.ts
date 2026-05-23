import { responses } from "@/lib/api-response";
import { verifyToken } from "@/lib/jwt";

export const dynamic = 'force-dynamic';
import { GetAccountById } from "@/lib/account";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const headersList = headers();
    const authorization = headersList.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return responses.unauthorized("Không tìm thấy Access Token");
    }

    const token = authorization.split(" ")[1];
    
    if (!token) {
      return responses.unauthorized("Token không hợp lệ");
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.accountId) {
      return responses.unauthorized("Token đã hết hạn hoặc không hợp lệ");
    }

    const accountId = payload.accountId as string;
    const existingAccount = await GetAccountById(accountId);

    if (!existingAccount) {
      return responses.unauthorized("Không tìm thấy thông tin người dùng");
    }

    // Lọc bỏ password hoặc thông tin nhạy cảm (mặc dù GetAccountById đã k trả về password)
    return responses.ok(existingAccount);
  } catch (error) {
    console.error("[GET ME ERROR]", error);
    return responses.serverError("Lỗi hệ thống");
  }
}
