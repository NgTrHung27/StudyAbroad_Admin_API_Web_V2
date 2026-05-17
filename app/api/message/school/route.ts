import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp schoolId" },
        { status: 400 }
      );
    }

    const students = await db.student.findMany({
      where: { schoolId },
      select: {
        id: true,
        studentCode: true,
        chats: {
          select: {
            id: true,
            name: true,
            messeges: {
              orderBy: { createAt: "desc" },
              take: 1,
              select: {
                content: true,
                createAt: true,
              },
            },
          },
        },
        account: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy tin nhắn trường" },
      { status: 500 }
    );
  }
}
