import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoutes = createRouteMatcher([
  "/login(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/socket.io(.*)",
  "/firebase-messaging-sw.js(.*)",
]);

export default clerkMiddleware(
  (auth, req) => {
    const { protect, userId } = auth();

    if (!isPublicRoutes(req)) protect();
  },
  {
    clockSkewInMs: 30000,
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
