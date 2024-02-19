<script>
  import confetti from 'canvas-confetti';
  import {fade} from "svelte/transition";

  let clickCount = 0;
  let buttonLabel = 'DON\'T PRESS ME';
  let hiddenMessage = "I want to work with persistent people like you.";
  let showConfetti = false;
  let finished = false;

  function handleClick() {
    clickCount += 1;
    if (!finished) {

      if (clickCount > 5) buttonLabel = 'HOW DARE YOU?';
      if (clickCount > 10) buttonLabel = 'PERSISTENT, ARE WE NOT?';
      if (clickCount > 15) buttonLabel = 'OH, COME ON NOW!';
      if (clickCount > 20) {
        buttonLabel = 'YOU ARE A TRUE PYONEER!';
        showConfetti = true;
      }
      if (clickCount > 25) {
        buttonLabel = 'I\'M DONE WITH YOU!';
        finished = true;
      }
    } else {
      confetti({
        particleCount: 100, spread: 360, decay: 0.94, gravity: 0,
        origin: {x: Math.random(), y: Math.random()},
        shapes:['star'], colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
      })
      if (clickCount === 25) {
        buttonLabel = 'ENOUGH, BUDDY...';
      }
    }
  }
</script>

<button id="obnoxious-button" class="rounded-md bg-black" on:click={handleClick}>
  <span class="block text-black bg-amber-400 -translate-x-2 -translate-y-2 rounded-md border-2 border-black p-4 text-xl transition-all hover:-translate-y-3 active:translate-x-0 active:translate-y-0">
    {buttonLabel}
  </span>
</button>

{#key finished}
  <span id="hidden-message" class="mt-3" class:invisible={!finished} in:fade>
    {hiddenMessage}
  </span>
{/key}