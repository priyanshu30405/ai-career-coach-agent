import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Exclude public webhooks, static files, images, and favicon
    "/((?!api/webhook|_next/static|_next/image|favicon.ico).*)",
  ],
}; 