<script>
    import {allowedChatButtons} from "../../chatAssistant.ts";

    export let chatSelector = "#chat-container"
    let excusesCount = 3
    let isSending = false

    import ChatMessage from "./ChatMessage.svelte";

    export let messages = [
        {sender: 'assistant', content: 'Hey chief. I\'m here to help you become a 10x engineer.'},
        {sender: 'user', content: 'I\'m not ready to become a 10x engineer...'},
    ]
    export let buttons = allowedChatButtons

    async function sendMessage(userInput) {
        isSending = true

        await htmx.ajax('POST', '/partials/chat_message/', {values: {sender: 'user', input: userInput}, target: chatSelector, swap: `beforeend scroll:${chatSelector}:bottom`})
        await new Promise(r => setTimeout(r, 300));
        await htmx.ajax('POST', '/partials/chat_message/', {values: {sender: 'assistant', input: userInput}, target: chatSelector, swap: `beforeend scroll:${chatSelector}:bottom`})

        excusesCount--

        buttons = buttons.filter(button => button.input !== userInput)

        isSending = false
    }
</script>

<div id="chat-container" class="flex flex-col w-full max-w-xl max-lg:min-h-[20rem] max-lg:max-h-[35rem] lg:h-[20rem] p-8 gap-y-0.5 overflow-y-auto rounded-l-box rounded-tr-box max-lg:rounded-r-box bg-base-100/20 border border-base-100 relative scroll-smooth">
    {#each messages as message}
        <ChatMessage sender={message.sender}>
            {message.content}
        </ChatMessage>
    {/each}

    {#if isSending}
        <ChatMessage sender="assistant" class="order-last">
            <span class="loading loading-dots loading-sm"></span>
        </ChatMessage>
    {/if}
</div>

<div id="chat-buttons" class="flex w-full gap-0.5 justify-center mt-3">
    {#each buttons as button}
        <button class="btn btn-ghost" on:click={sendMessage(button.input)} disabled={isSending}>
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