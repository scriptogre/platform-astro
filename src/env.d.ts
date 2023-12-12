/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly OPENAI_API_KEY: string
    readonly SUPABASE_URL: string
    readonly SUPABASE_ANON_KEY: string
    readonly DISCORD_BOT_TOKEN: string
    readonly DISCORD_GUILD_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}