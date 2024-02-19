// src/middleware.js
import { sequence } from "astro:middleware";
import { getUser } from "./auth.ts";
import { getEntry } from "astro:content";

/**
 * Middleware to handle direct access to modal paths in an Astro/HTMX project.
 *
 * Why this middleware exists:
 * - The site has several server-side rendered (SSR) pages marked as non-prerenderable (prerender = false),
 *   particularly under the /auth/ paths, presented as modal dialogs.
 * - Direct browser access to these paths (e.g., via a link or manual URL entry) would display only the dialog content,
 *   which is not the intended user experience.
 * - This middleware detects such direct accesses, and instead of serving just the dialog,
 *   it redirects the user to the homepage with a `modal_url` query parameter.
 * - The frontend then uses this parameter to open the appropriate modal via HTMX, ensuring a consistent UX.
 *
 * @module src/middleware
 *
 * @example
 * // User directly accesses '<domain>/auth/password_reset_set_new/?code=12345' (from email link):
 * // 1. The middleware identifies '/auth/password_reset_set_new/' as direct modal access.
 * // 2. It redirects to '<domain>/?modal_url=/auth/password_reset_set_new/&code=12345'.
 * // 3. On homepage load, a script triggers an HTMX request to display the modal.
 */
async function redirectDirectModalAccess({ request }, next) {
  // Define the list of modal views
  const modalViews = [
    "/auth/login",
    "/auth/register",
    "/auth/logout",
    "/auth/password_reset_request",
    "/auth/password_reset_requested",
    "/auth/password_reset_set_new",
    "/auth/password_reset_success",
    "/auth/register_done",
    "/stripe/checkout_success",
    "/stripe/checkout_cancelled",
  ];

  // Extract the URL and query parameters from the request
  const requestUrl = new URL(request.url);
  const requestPath = requestUrl.pathname;
  const searchParams = requestUrl.searchParams;

  // Check if the path is a modal view
  if (modalViews.includes(requestPath)) {
    // Check if the request is not from HTMX (direct browser access)
    if (!request.headers.get("HX-Request")) {
      // Create the redirect URL (home page)
      const homeUrl = new URL("/", request.url);

      // Add existing query parameters to the home URL
      searchParams.forEach((value, key) => {
        homeUrl.searchParams.set(key, value);
      });

      // Add the modal_url parameter with the original path
      homeUrl.searchParams.set("modal_url", requestPath);

      // Redirect to the home URL with the combined query parameters
      return Response.redirect(homeUrl, 302);
    }
  }

  // Continue with the next middleware or route
  return next();
}

async function restrictPaidContent({ request, redirect }, next) {
  // Parse the request URL
  const requestUrl = new URL(request.url);

  // Skip this middleware if the request is not for a course page or is an HTMX request
  if (!requestUrl.pathname.startsWith("/course")) {
    return next();
  }

  const { isLoggedIn } = await getUser();

  // Get the slug from the pathname by removing the '/course/' prefix and removing any trailing slashes
  const slug = requestUrl.pathname.replace("/course/", "").replace(/\/$/, "");

  // Get the content entry
  const entry = await getEntry("course_lessons", slug);

  // If entry is paid content and user has not purchased the course, redirect to index
  if (entry.data.isPaid && !isLoggedIn) {
    return redirect("/");
  }

  return next();
}

export const onRequest = sequence(
  redirectDirectModalAccess,
  restrictPaidContent,
);
