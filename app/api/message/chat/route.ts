import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp chatId" },
        { status: 400 }
      );
    }

    const messages = await db.message.findMany({
      where: { chatId },
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
      { error: "Lỗi lấy tin nhắn" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatId, studentCode, content } = body;

    if (!chatId || !studentCode || !content) {
      return NextResponse.json(
        { error: "Thiếu thông tin cần thiết" },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        chatId,
        studentCode,
        content,
      },
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

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi gửi tin nhắn" },
      { status: 500 }
    );
  }
}
