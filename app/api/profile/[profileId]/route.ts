import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const profile = await db.profile.findFirst({
      where: {
        id: params.profileId,
      },
      select: {
        id: true,
        biography: {
          select: {
            id: true,
            content: true,
          },
        },
        student: {
          select: {
            account: {
              select: {
                id: true,
                image: true,
                address: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return responses.notFound("Không tìm thấy profile trong database");
    }

    return responses.ok(profile);
  } catch (error) {
    console.error("[GET PROFILE ERROR]", error);
    return responses.serverError("Không lấy được thông tin profile");
  }
}
