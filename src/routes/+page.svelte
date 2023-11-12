<script>
  import Minefield from "$lib/components/Minefield.svelte"

  /** @type {'win' | 'exploded' | null}*/
  let result = null
  
  let unique = {}
  function restart() {
    result = null
    unique = {} // every {} is unique, {} === {} evaluates to false
  }
</script>

<div class="main">
  {#key unique}
    <Minefield on:gameover={({detail})=>{result=detail}}/>
  {/key}
  <div class="status">
  {#if result}
    <h2>
      {result=='win' ? `You win!` : 'Too bad!'}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="button" on:click={restart}>Try again?</span>
    </h2>
  {/if}
  </div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .status {
    height: 100px;
  }

  .button {
    background-color: #fff;
    border: 1px solid #d5d9d9;
    border-radius: 8px;
    box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
    box-sizing: border-box;
    color: #0f1111;
    cursor: pointer;
    display: inline-block;
    font-size: large;
    line-height: 40px;
    padding: 0 10px 1px 10px;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
  }

  .button:hover {
    background-color: #f7fafa;
  }

  .button:focus {
    border-color: #008296;
    box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
    outline: 0;
  }
</style>