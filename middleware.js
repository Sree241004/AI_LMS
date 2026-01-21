import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that REQUIRE login
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/create",
  "/course(.*)",
]);

// Routes that should be PUBLIC (no auth)
const isPublicRoute = createRouteMatcher([
  "/api/generate-course-outline",   // 👈 VERY IMPORTANT
]);

export default clerkMiddleware(async (auth, req) => {
  // If this is a protected page, enforce auth
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // If it's public API, do NOTHING (allow access)
  if (isPublicRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Run middleware for all API routes
    "/(api|trpc)(.*)",
  ],
};
