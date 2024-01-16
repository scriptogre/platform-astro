// auth.ts
// Purpose: This file contains all authentication-related functions for the application.
// It interfaces with Supabase to handle user login, registration, logout, and fetching user information.

import {supabase} from "./lib/supabase.ts";
import type {Provider} from "@supabase/supabase-js";
import {redirectWithHtmx} from "./utils.ts";

// Utility Constants
const validProviders = ["google", "github", "discord"];

// Internal utility functions
async function signInWithOAuth({ provider, url }) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: { redirectTo: `${url.origin}/auth/callback/` }
  });

  if (error) throw new Error(error.message);
  return data.url;
}

async function signInWithPassword({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);
  return data.session;
}

// Exported functions
/**
 * Handles the user login process.
 *
 * This function authenticates a user either through OAuth providers or with email and password.
 * It sets session cookies upon successful authentication.
 *
 * @param {Object} params - The parameters for the login process.
 * @param {FormData} params.formData - The form data containing login credentials.
 * @param {Cookies} params.cookies - Cookie storage to manage session tokens.
 * @param {URL} params.url - The current URL context.
 * @returns {Object} An object containing the redirect URL and any error messages.
 *   - `redirectUrl`: String URL to redirect the user after successful login.
 *   - `errors`: Array of strings representing any error messages encountered during login.
 */
export async function login({ formData, cookies, url }) {
  let errors = [];
  let redirectUrl = "/";

  // Check if the user is already logged in
  const { isLoggedIn } = await getUser();
  if (isLoggedIn) {
    return { redirectUrl, errors };
  }

  const provider = formData.get("provider")?.toString();
  try {
    // Handle OAuth login if a provider is specified
    if (provider && validProviders.includes(provider)) {
      redirectUrl = await signInWithOAuth({ provider, url });
    } else {
      // Handle email/password login
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const session = await signInWithPassword({ email, password });
      cookies.set("sb-access-token", session.access_token, { path: "/" });
      cookies.set("sb-refresh-token", session.refresh_token, { path: "/" });
    }
  } catch (error) {
    errors.push(error.message);
  }

  return { redirectUrl, errors };
}

// Note: Logout is handled directly in logout.astro for simplicity.
// export async function logout({ request, cookies, url }) {
//   ...
// }

/**
 * Handles the user registration process.
 *
 * This function registers a new user using their email and password.
 *
 * @param {Object} params - The parameters for the registration process.
 * @param {FormData} params.formData - The form data containing registration details.
 * @returns {Object} An object containing any error messages encountered during registration.
 *   - `errors`: Array of strings representing any error messages.
 */
export async function register({ formData }) {
  let errors = [];

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  console.log(email, password)

  if (!email || !password) {
    errors.push("Email and password are required");
    return { errors };
  }

  const { data, error} = await supabase.auth.signUp({ email, password });

  if (error) {
    errors.push(error.message);
  }

  return { errors };
}

/**
 * Retrieves the current user's information.
 *
 * @returns {Object} An object containing user information and login status.
 *   - `isLoggedIn`: boolean indicating if the user is logged in.
 *   - `avatarUrl`: string representing the user's avatar URL (if logged in).
 *   - `userEmail`: string representing the user's email (if logged in).
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isLoggedIn: false };
  }

  return {
    isLoggedIn: true,
    avatarUrl: user.user_metadata.avatar_url,
    userEmail: user.email
    // Include other user details you need
  };
}
