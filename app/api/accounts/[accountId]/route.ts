import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const account = await db.account.findUnique({
      where: { id: params.accountId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dob: true,
        emailVerified: true,
        phoneNumber: true,
        address: true,
        idCardNumber: true,
        isTwoFactorEnabled: true,
        student: {
          select: {
            id: true,
            studentCode: true,
            status: true,
            school: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
        isLocked: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản" },
        { status: 404 }
      );
    }

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy thông tin tài khoản" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body = await req.json();

    const account = await db.account.update({
      where: { id: params.accountId },
      data: body,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dob: true,
        phoneNumber: true,
        address: true,
      },
    });

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi cập nhật tài khoản" },
      { status: 500 }
    );
  }
}
