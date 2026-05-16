import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentCode = searchParams.get("studentCode");

    if (!studentCode) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp studentCode" },
        { status: 400 }
      );
    }

    const chats = await db.chat.findMany({
      where: {
        students: {
          some: {
            studentCode,
          },
        },
      },
      include: {
        messeges: {
          orderBy: { createAt: "desc" },
          take: 1,
        },
        students: {
          select: {
            id: true,
            studentCode: true,
            account: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy tin nhắn sinh viên" },
      { status: 500 }
    );
  }
}
