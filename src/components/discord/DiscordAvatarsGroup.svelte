<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { quintOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';

    const endpoint = 'http://localhost:4321/api/discord/latest_members';

    let latestUsers = []
    let totalUserCount

    const counter = tweened(0, {
        duration: 3000,
        easing: quintOut,
    })

    onMount(async () => {
        const response = await fetch(endpoint);
        const discordMembersData = await response.json();
        latestUsers = discordMembersData.latestUsers
        totalUserCount = discordMembersData.totalUserCount

        // Wait a bit before showing the total user count
        setTimeout(() => {
            counter.set(totalUserCount - latestUsers.length)
        }, 1000)
    })

    $: displayedCount = Math.round($counter);
</script>

<div class="avatar-group -space-x-6 min-w-[80px]">
    {#each latestUsers as user, index (user.id)}
        <div class="flex" class:invisible={!latestUsers} transition:fade={{ delay: index * 250, duration: 500 }}>
            <div class="avatar border-[3px] lg:border-[3px]">
                <div class="w-8 h-8">
                    {#if user.id && user.avatar_hash}
                        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar_hash}.png`} alt="" class="m-0" />
                    {/if}
                </div>
            </div>
        </div>
    {/each}
    {#key totalUserCount}
        <div class="flex" class:invisible={!totalUserCount} in:fade={{ delay: 750, duration: 500 }}>
            <div class="avatar border-[3px] lg:border-[3px] placeholder">
                <div class="w-8 h-8 bg-neutral-focus text-neutral-content">
                    <span class="text-xs font-semibold">+{displayedCount}</span>
                </div>
            </div>
        </div>
    {/key}
</div>
