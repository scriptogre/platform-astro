<script>
    import ChatMessage from "./ChatMessage.svelte";

    export let messages = [
        {sender: 'assistant', content: 'Hey chief. I\'m here to help you become a 10x engineer.'},
        {sender: 'user', content: 'I\'m not ready to become a 10x engineer...'},
    ]
    export let buttons = [
        {label: 'No Time', query: 'I don\'t have time to become a 10x engineer'},
        {label: 'No Money', query: 'I don\'t have money to become a 10x engineer'},
        {label: 'No Energy', query: 'I don\'t have energy to become a 10x engineer'},
    ]

    let excusesCount = 3
    let isSending = false

    async function sendMessage(userInput) {
        messages = [...messages, {sender: 'user', content: userInput}]

        isSending = true

        let answer = await fetch('/api/chat/ask_assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: userInput})
        })
            .then(response => response.json())
            .then(data => data.answer)

        messages = [...messages, {sender: 'assistant', content: answer}]

        excusesCount--

        buttons = buttons.filter(button => button.query !== userInput)

        isSending = false
    }
</script>

<div id="chat-container" class="flex flex-col w-full max-lg:min-h-[20rem] max-lg:max-h-[35rem] lg:h-[20rem] p-8 gap-y-0.5 overflow-y-auto rounded-l-box rounded-tr-box max-lg:rounded-r-box bg-base-100/20 border border-base-100 relative scroll-smooth">
    <div>
        {#each messages as message}
            <ChatMessage sender={message.sender}>
                {message.content}
            </ChatMessage>
        {/each}

        {#if isSending}
            <ChatMessage sender="assistant">
                <span class="loading loading-dots loading-sm"></span>
            </ChatMessage>
        {/if}
    </div>
</div>

<div id="chat-buttons" class="flex w-full gap-0.5 justify-center mt-3">
    {#each buttons as button}
        <button class="btn btn-ghost" on:click={sendMessage(button.query)} disabled={isSending}>
            {button.label}
        </button>
    {/each}
</div>