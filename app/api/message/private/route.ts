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

    const messages = await db.message.findMany({
      where: { studentCode },
      orderBy: { createAt: "desc" },
      take: 50,
      include: {
        chat: {
          select: {
            id: true,
            name: true,
          },
        },
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
      { error: "Lỗi lấy tin nhắn riêng tư" },
      { status: 500 }
    );
  }
}
