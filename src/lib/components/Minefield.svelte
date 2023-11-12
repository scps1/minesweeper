<script>
  import Square from "$lib/components/Square.svelte"
  import { createEventDispatcher } from "svelte"
  import { Minesweeper } from "$lib/Minesweeper.js"

  /** @type {Array<Array<Square>>}*/
  let sqaures = [[],[],[],[],[],[],[],[]]
  const dispatch = createEventDispatcher()
  
  /** @type {number | undefined} */ let intervalId
  let seconds = 0, flags = 10, finished = false

  const mine = new Minesweeper()

  /** @param {CustomEvent} event */
  function flag(event) {
    const {row, col} = event.detail
    const flagged = mine.flag(row, col)
    if (flagged !== undefined) {
      sqaures[row][col].$set({flagged, misflagged: false})
      flags += flagged ? -1 : 1
    }
  }

  /** @param {CustomEvent} event */
  function reveal(event) {
    if (intervalId===undefined && !finished) intervalId = setInterval(()=>{seconds++}, 1000)
    const {row, col} = event.detail
    const {gameOver, updates} = mine.reveal(row, col)
    if (gameOver) {
      dispatch('gameover', gameOver)
      clearInterval(intervalId)
      finished = true
    }
    for (let {row: r, col: c, ...props} of updates) {
      sqaures[r][c].$set(props)
    }
  }
</script>

<div>
  <div class="header">
    <span>🚩 {flags}</span>
    <span>Minesweeper</span>
    <span>{seconds}</span>
  </div>
  {#each [0,1,2,3,4,5,6,7] as row}
  <div class="row">
    {#each [0,1,2,3,4,5,6,7,8,9] as col}
      <Square {row} {col} bind:this={sqaures[row][col]}
        on:flag={flag}
        on:reveal={reveal}
      />
    {/each}
  </div>  
  {/each}
</div>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: large;
    font-weight: bold;
    padding-bottom: 8px;
  }
  .row {
    display: flex;
  }
</style>
