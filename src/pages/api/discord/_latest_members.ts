export async function GET({params, request}) {
    const DISCORD_BOT_TOKEN = import.meta.env.DISCORD_BOT_TOKEN;
    const DISCORD_GUILD_ID = import.meta.env.DISCORD_GUILD_ID;

    const discordApiUrl = `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members?limit=1000`;
    const discordApiHeaders = {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    };

    const response = await fetch(discordApiUrl, { headers: discordApiHeaders });
    const data = await response.json();

    const totalUserCount = data.length;
    const recentlyJoinedUsers = data.sort((a, b) => {
        // @ts-ignore
        return new Date(b.joined_at) - new Date(a.joined_at); // sort by date descending
    });
    const latestUsers = recentlyJoinedUsers
        .filter(member => member.user.avatar && !member.user.bot) // filter out bots and users without avatars
        .slice(0, 3) // get the first 3 users
        .map(member => ({ id: member.user.id, avatar_hash: member.user.avatar })) // map to avatar object

        return new Response(
            JSON.stringify({ latestUsers: latestUsers, totalUserCount: totalUserCount }),
            { headers: { 'Content-Type': 'application/json' }
        });
}