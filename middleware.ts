import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const isPublicRoutes = createRouteMatcher([
  "/login(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/socket.io(.*)",
  "/firebase-messaging-sw.js(.*)",
  "/auth/new-verification(.*)",
]);

const isPublicApiRoutes = createRouteMatcher([
  "/api/auth(.*)",
  "/api/schools(.*)",
  "/api/news(.*)",
  "/api/country(.*)",
  "/api/nameSchools(.*)",
  "/api/edgestore(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    const { protect } = auth();

    if (!isPublicRoutes(req)) protect();

    // Protect API routes with custom JWT logic
    if (req.nextUrl.pathname.startsWith("/api") && !isPublicApiRoutes(req)) {
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { statusCode: 401, message: "Không tìm thấy Access Token" },
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { statusCode: 401, message: "Không tìm thấy Access Token" },
          { status: 401 }
        );
      }

      const payload = await verifyToken(token);

      if (!payload) {
        return NextResponse.json(
          { statusCode: 401, message: "Token đã hết hạn hoặc không hợp lệ" },
          { status: 401 }
        );
      }
    }
  },
  {
    clockSkewInMs: 30000,
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
