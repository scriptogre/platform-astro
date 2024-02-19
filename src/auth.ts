// auth.ts
// Purpose: This file contains all authentication-related functions for the application.
// It interfaces with Supabase to handle user login, registration, logout, and fetching user information.

import { supabase } from "./lib/supabase.ts";
import type { Provider } from "@supabase/supabase-js";
import { redirectWithHtmx } from "./utils.ts";

// Utility Constants
const validProviders = ["google", "github", "discord"];

export async function login(provider, email, password, cookies, url) {
  try {
    if (provider && validProviders.includes(provider)) {
      // OAuth login
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: { redirectTo: `${url.origin}/auth/callback/` },
      });
      if (error) throw new Error(error.message);
      return { providerRedirectUrl: data.url };
    } else {
      // Email/password login
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);

      cookies.set("sb-access-token", data.session.access_token, { path: "/" });
      cookies.set("sb-refresh-token", data.session.refresh_token, {
        path: "/",
      });
      return {}; // Successful login, no redirect URL needed
    }
  } catch (error) {
    // Catch any errors
    return { error: error.message };
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message };
}

export async function register(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
  } catch (error) {
    return { error: error.message };
  }
}

export async function sendPasswordResetEmail(email, redirectTo) {
  return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
}

export async function updateUserPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { error: error?.message };
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isLoggedIn: false };
  }

  return {
    isLoggedIn: true,
    avatarUrl: user.user_metadata.avatar_url,
    userEmail: user.email,
    // Include other user details you need
  };
}
