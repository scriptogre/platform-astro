<script>
    export let chatSelector = "#chat-container"
    let excusesCount = 3
    let isSending = false

    export let buttons = []

    async function sendMessage(userInput) {
        isSending = true

        await htmx.ajax('POST', '/htmx_partials/chat/user', {values: {"input": userInput}, target: chatSelector, swap: `beforeend scroll:${chatSelector}:bottom`})
        await new Promise(r => setTimeout(r, 300));
        // await htmx.ajax('GET', '/htmx_partials/chat/typing_indicator', {target: chatSelector, swap: `beforeend scroll:${chatSelector}:bottom`})
        await htmx.ajax('POST', '/htmx_partials/chat/assistant', {values: {"query": userInput}, target: chatSelector, swap: `beforeend scroll:${chatSelector}:bottom`})

        excusesCount--
        buttons = buttons.filter(button => button.message !== userInput)  // Remove the clicked button
        isSending = false
    }
</script>

<div id="chat-buttons" class="flex w-full gap-0.5 justify-center">
    {#each buttons as button (button.label)}
        <button class="btn btn-ghost" disabled={isSending} on:click={() => sendMessage(button.message)}>
            {button.label}
        </button>
    {/each}
</div>
<span id="chat-excuses-counter" class="flex justify-center w-full text-lg text-gray-400 mt-3">
    {#if excusesCount === 0}
        📸 🤨 No excuses left
    {:else}
        Excuses {excusesCount}/3
    {/if}
</span>