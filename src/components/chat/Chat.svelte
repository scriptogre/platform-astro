<script>
    import ChatMessage from "./ChatMessage.svelte";
    import {allowedChatButtons} from "../../chatAssistant.ts";
    import {tick} from "svelte";

    let chatContainer
    let excusesCount = 3
    let disableButtons = false
    let showLoading = false;


    export let messages = [
        {sender: 'assistant', content: 'Hey chief. I\'m here to help you become a 10x engineer.'},
        {sender: 'user', content: 'I\'m not ready to become a 10x engineer...'},
    ]
    export let buttons = allowedChatButtons

    async function scrollChatToBottom() {
        await tick()
        chatContainer.scroll({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }

    async function sendMessage(button) {
        disableButtons = true

        await htmx.ajax('POST', '/partials/chat_message/', {values: {sender: 'user', input: button.input}, target: '#chat-container', swap: `beforeend scroll:#chat-container:bottom`})

        setTimeout(() => { showLoading = true; chatContainer.scroll({ top: chatContainer.scrollHeight, behavior: 'smooth' }); }, 300)

        await htmx.ajax('POST', '/partials/chat_message/', {values: {sender: 'assistant', input: button.input}, target: '#chat-container', swap: `beforeend scroll:#chat-container:bottom`})

        excusesCount--

        buttons = buttons.filter(b => b !== button)

        disableButtons = false
        showLoading = false
    }
</script>

<div class="flex flex-col justify-center items-center">

    <div bind:this={chatContainer} id="chat-container" class="flex flex-col w-full max-w-xl max-lg:min-h-[20rem] max-lg:max-h-[35rem] lg:h-[20rem] p-8 gap-y-0.5 overflow-y-auto rounded-l-box rounded-tr-box max-lg:rounded-r-box bg-base-100/20 border border-base-100 relative scroll-smooth">
        {#each messages as message}
            <ChatMessage sender={message.sender}>
                {message.content}
            </ChatMessage>
        {/each}

        {#if showLoading }
            <div class="order-last" use:scrollChatToBottom>
                <ChatMessage sender="assistant">
                    <span class="loading loading-dots loading-sm"></span>
                </ChatMessage>
            </div>
        {/if}
    </div>

    <div id="chat-buttons" class="flex w-full gap-0.5 justify-center mt-3">
        {#each buttons as button}
            <button class="btn btn-ghost" on:click={sendMessage(button)} disabled={disableButtons}>
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

</div>