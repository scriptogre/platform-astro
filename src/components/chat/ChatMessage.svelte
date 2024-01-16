<script>
    export let sender = 'user'; // Default value as a fallback
    export let text = '';

    const isUser = sender === 'user';
    const isAssistant = sender === 'assistant';
</script>

<div class="chat" class:chat-end={isUser} class:chat-start={isAssistant} {...$$restProps}>
    <div class="chat-image avatar">
        <div class="w-10 rounded-full">
            <img src={isUser ? '/user-avatar.webp' : '/assistant-avatar.webp'} alt={isUser ? 'User Avatar' : 'Giga Chad Avatar'} width="40" height="40" />
        </div>
    </div>
    <div class={['flex chat-bubble', isAssistant ? 'bg-base-100/60' : ''].join(' ')}>
        {text}
        <slot/>
    </div>
</div>
