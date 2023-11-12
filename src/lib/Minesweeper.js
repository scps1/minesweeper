/**
 * @typedef {{
 *  row: number,
 *  col: number,
 *  hasBomb: boolean,
 *  flagged: boolean,
 *  revealed: boolean,
 *  adjBombs: number,
 *  exploded?: boolean
 * }} SquareState
 */

/** @typedef {'win' | 'exploded' | undefined} GameState */

/**
 * @typedef {{
 *   row: number,
 *   col: number,
 *   revealed?: boolean,
 *   adjBombs?: number,
 *   hasBomb?: boolean,
 *   misflagged?: boolean,
 *   exploded?: boolean
 * }} SquareUpdate
 */

/**
  * @typedef {{
  *   gameOver?: GameState,
  *   updates: Array<SquareUpdate>,
  * }} SquareUpdates
  */

/** @param {Array<Array<SquareState>>} field */
function initializeField(field) {
  for (let row=0; row<8; row++) {
    for (let col=0; col<10; col++) {
      field[row].push({row, col, hasBomb: false, flagged: false, revealed: false, adjBombs: 0})
    }
  }
}

/** @param {Array<Array<SquareState>>} field */
function placeMines(field) {
  /** Radomly place 10 bombs */
  const indexes = [...Array(80)].map((_,i)=>i)
  for (let i=0; i<10; i++) {
    const rnd = Math.floor(Math.random()*(80-i))
    const index = indexes[rnd]
    const row = Math.floor(index / 10)
    const col = index % 10
    field[row][col].hasBomb = true
    for (let r=Math.max(row-1, 0); r<Math.min(row+2, 8); r++) {
      for (let c=Math.max(col-1, 0); c<Math.min(col+2, 10); c++) {
        field[r][c].adjBombs++
      }
    }
    indexes.splice(rnd, 1)
  }
}

/** @param {Array<Array<SquareState>>} field */
function hasWon(field) {
  let unrevealed = 0
  for (let r=0; r<8; r++) {
    for (let c=0; c<10; c++) {
      if (!field[r][c].revealed) unrevealed++
    }
  }
  return unrevealed==10
}

export class Minesweeper {
  constructor() {
    /** @type {Array<Array<SquareState>>} */
    this.field = [[],[],[],[],[],[],[],[]]
    initializeField(this.field)
    placeMines(this.field)
    this.finished = false
  }

 /**
  * @param {number} row
  * @param {number} col
  * @returns {SquareUpdates}
  */
  reveal(row, col) {
    /** @type {GameState} */ let gameOver
    /** @type {Array<SquareUpdate>} */ let updates = []

    const sq = this.field[row][col]
    const {hasBomb, adjBombs, flagged} = sq
    if (sq.revealed || flagged) return {updates}
    const revealed = sq.revealed = true
    if (hasBomb) {
      if (!this.finished) {
        gameOver = 'exploded'
        sq.exploded = true
        updates.push({row, col, revealed, hasBomb, exploded: true})
        for (let r=0; r<8; r++) {
          for (let c=0; c<10; c++) {
            if (r==row && col==c) continue
            const mf = this.field[r][c]
            if (mf.hasBomb && !mf.flagged) {
              mf.revealed = true
              updates.push({row: r, col: c, revealed, hasBomb})
            }
            if (mf.flagged && !mf.hasBomb) {
              updates.push({row: r, col: c, misflagged: true})
            }
          }
        }
      } else {  // hasBomb but finished
        updates.push({row, col, revealed, hasBomb})
      }
    } else {
      updates.push({row, col, revealed, adjBombs})
      if (adjBombs==0) {
        for (let r=Math.max(0, row-1); r<Math.min(row+2, 8); r++) {
          for (let c=Math.max(0, col-1); c<Math.min(col+2, 10); c++) {
            if (!this.field[r][c].revealed) {
              updates.push(...(this.reveal(r, c).updates))
            }
          }
        }  
      }
    }
    if (hasWon(this.field)) gameOver = 'win'
    if (gameOver) {
      this.finished = true
      return {gameOver, updates}
    } else {
      return {updates}
    }
  }

  /**
   * @param {number} row
   * @param {number} col
   * @returns {boolean | undefined}
   */
  flag(row, col) {
    const sq = this.field[row][col]
    if (sq.revealed) return
    return sq.flagged = !sq.flagged
  }
}