import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
        return new Response("Email is required", { status: 400 });
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://localhost:4321',
    })

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    return redirect("/auth/reset_password_done");
}