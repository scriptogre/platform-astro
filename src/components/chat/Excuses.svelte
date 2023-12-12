<script>
    export let chatSelector = "#chat-container"
    let excusesCount = 3
    let isSending = false

    export let buttons = []

    async function sendMessage(userInput) {
        isSending = true

        await htmx.ajax('POST', '/partials/chat/user', {values: {"user_input": userInput}, target: chatSelector, swap: `beforeend scroll:${chatSelector}:bottom`})
        await new Promise(r => setTimeout(r, 300));
        await htmx.ajax('GET', '/partials/chat/typing_indicator', {target: chatSelector, swap: `beforeend scroll:${chatSelector}:bottom`})
        await htmx.ajax('GET', '/partials/chat/gpt', {values: {"user_input": userInput}, target: "#typing-indicator", swap: `outerHTML scroll:${chatSelector}:bottom`})

        excusesCount--
        buttons = buttons.filter(button => button.message !== userInput)  // Remove the clicked button
        isSending = false
    }
</script>

<div id="excuse-buttons" class="flex w-full gap-0.5 justify-center">
    {#each buttons as button (button.label)}
        <button class="btn btn-ghost" disabled={isSending} on:click={() => sendMessage(button.message)}>
            {button.label}
        </button>
    {/each}
</div>
<span id="excuse-counter" class="flex justify-center w-full text-lg text-gray-400 mt-3">
    {#if excusesCount === 0}
        📸 🤨 No excuses left
    {:else}
        Excuses {excusesCount}/3
    {/if}
</span>