import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return responses.badRequest("Vui lòng cung cấp profileId");
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
      return responses.notFound("Không tìm thấy profile");
    }

    return responses.ok(profile);
  } catch (error) {
    console.error("[GET PROFILE BIO ERROR]", error);
    return responses.serverError("Lỗi lấy thông tin bio");
  }
}
