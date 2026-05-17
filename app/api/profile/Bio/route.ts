import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp profileId" },
        { status: 400 }
      );
    }

    const profile = await db.profile.findFirst({
      where: {
        id: profileId,
      },
      select: {
        id: true,
        biography: {
          select: {
            id: true,
            content: true,
            areas: {
              select: {
                area: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
            socials: {
              select: {
                id: true,
                type: true,
                href: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Không tìm thấy profile" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy thông tin bio" },
      { status: 500 }
    );
  }
}
