<script>
  import { onMount } from 'svelte'
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  /** @type {HTMLDivElement}*/ let self

  /** @type {number}*/  export let row
  /** @type {number}*/  export let col
  /** @type {boolean}*/ export let revealed = false
  /** @type {number}*/  export let adjBombs = 0
  /** @type {boolean}*/ export let hasBomb = false
  /** @type {boolean}*/ export let flagged = false
  /** @type {boolean}*/ export let misflagged = false
  /** @type {boolean}*/ export let exploded = false

  onMount(async () => {
    self.classList.remove((row+col)%2 ? 'light' : 'dark')
	})

  $: Revealed = revealed ? 'revealed' : ''
  $: Exploded = exploded ? 'exploded' : ''
  $: Misflagged = misflagged ? 'misflagged' : ''
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="square light dark {Revealed} {Exploded}" bind:this={self}
  on:contextmenu|preventDefault={()=>{dispatch('flag', {row, col})}}
  on:click|preventDefault={()=>{dispatch('reveal', {row, col})}}
>
  {#if flagged}<div class="flag {Misflagged}">🚩</div>{/if}
  {#if exploded || (revealed && hasBomb)}💣{/if}
  {#if adjBombs!==0 && !hasBomb}{adjBombs}{/if}
</div>

<style>
  .square {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px; /* Adjust the square size */
    height: 40px;
    box-sizing: border-box;
    font-size: larger;
    font-weight: bolder;
    color: red;
    user-select: none;
  }

  .square.light {
    background-color: #80D830;
  }

  .square.dark {
    background-color: #78C830;
  }

  .square.dark.revealed,
  .square.light.revealed {
    background-color: lightgray;
  }

  .square.dark.exploded,
  .square.light.exploded {
    background-color: #F08080;
  }

  div.flag {
    position: relative;
  }

  div.flag.misflagged::before,
  div.flag.misflagged::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 2px; /* Thickness of the cross lines */
    background-color: red;
    z-index: 1;
  }

  div.flag.misflagged::before {
    transform: rotate(45deg); /* Rotate the line to form an 'X' */
    top: calc(50% - 1px); /* Position the line vertically */
    left: 0;
  }

  div.flag.misflagged::after {
    transform: rotate(-45deg); /* Rotate the line to form an 'X' */
    top: calc(50% - 1px); /* Position the line vertically */
    left: 0;
  }
</style>