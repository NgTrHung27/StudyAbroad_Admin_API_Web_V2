import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp groupId" },
        { status: 400 }
      );
    }

    const messages = await db.message.findMany({
      where: { chatId: groupId },
      orderBy: { createAt: "asc" },
      include: {
        student: {
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

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy tin nhắn nhóm" },
      { status: 500 }
    );
  }
}
