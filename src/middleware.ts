import { defineMiddleware } from "astro:middleware";

const AUTH_COOKIE_NAME = "authenticated";
const PASSWORD = process.env.APP_PASSWORD || "changeme123";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // Allow access to login page, API routes, and static assets
  if (pathname === "/login" || pathname.startsWith("/api/") || pathname.startsWith("/@") || pathname.includes(".")) {
    return next();
  }
  
  // Check if user is authenticated
  const authCookie = context.cookies.get(AUTH_COOKIE_NAME);
  
  if (!authCookie?.value || authCookie.value !== "true") {
    // Redirect to login page if not authenticated
    return context.redirect("/login");
  }
  
  return next();
});

export function validatePassword(inputPassword: string): boolean {
  return inputPassword === PASSWORD;
}