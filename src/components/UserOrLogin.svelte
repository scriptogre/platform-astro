<script>
    import { onMount } from 'svelte';

    import { createClient } from '@supabase/supabase-js'

    const supabase = createClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_ANON_KEY
    )

    let isLoggedIn = true;
    let avatar_url;
    let email;

    onMount(async () => {
        const accessToken = localStorage.getItem("sb-access-token");
        const refreshToken = localStorage.getItem("sb-refresh-token");

        console.log(accessToken, refreshToken);
        if (!accessToken || !refreshToken) {
            isLoggedIn = false;
        }

        if (error) {
            localStorage.removeItem("sb-access-token");
            localStorage.removeItem("sb-refresh-token");

            isLoggedIn = false;
        }

        avatar_url = data?.user?.user_metadata.avatar_url;
        email = data?.user?.email;
    });
</script>

{#if isLoggedIn}
    <details class="dropdown dropdown-bottom dropdown-end">
        <summary class="btn btn-ghost btn-circle">
            <span class="avatar size-10">
                <img src={avatar_url || '/avatar-default.webp'} alt="user avatar" width="40" height="40" class="rounded-full" />
            </span>
        </summary>

        <ul class="dropdown-content menu text-sm text-base-content font-semibold bg-base-100/60 backdrop-blur border border-base-100 rounded-xl">
            <li class="menu-title">
                <span class="text-sm font-semibold text-base-content/80">
                    {email}
                </span>
            </li>
            <li>
                <a id="logout-button" href="/api/auth/signout">

                    Logout
                </a>
            </li>
        </ul>e
    </details>
{:else}
    <button id="login-button" class="btn btn-square btn-ghost" title="Login">

    </button>
{/if}