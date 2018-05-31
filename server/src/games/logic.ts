import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Board, Symbol, Row } from './entities'

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {
  boardLength = 6// height of the board, number of rows
  rowLength = 7 // width of the board, number of columns

  validate(board: Board) {
    const symbols = [ 'x', 'o', null ]
    return board.length === this.boardLength &&
      board.every(row =>
        row.length === this.rowLength &&
        row.every(symbol => symbols.includes(symbol))
      )
  }
}

export const isValidTransition = (playerSymbol: Symbol, from: Board, to: Board) => {
  const changes = from
    .map(
      (row, rowIndex) => row.map((symbol, columnIndex) => ({
        from: symbol, 
        to: to[rowIndex][columnIndex]
      }))
    )
    .reduce((a,b) => a.concat(b))
    .filter(change => change.from !== change.to)

  return changes.length === 1 && 
    changes[0].to === playerSymbol && 
    changes[0].from === null
}

export const calculateWinner = (board: Board): Symbol | null =>
  board
  .concat(
    // vertical winner
    [0, 1, 2].map(n => board.map(row => row[n])) as Row[]
    )
  .concat(
    [
      // diagonal winner ltr
      [0, 1, 2].map(n => board[n][n]),
      // diagonal winner rtl
      [0, 1, 2].map(n => board[2-n][n])
    ] as Row[]
  )
  .filter(row => row[0] && row.map(symbol => symbol === row[0]))
  .map(row => row[0])[0] || null
  

export const finished = (board: Board): boolean =>
  board
    .reduce((a,b) => a.concat(b) as Row)
    .every(symbol => symbol !== null)

    // .reduce(function(prev, curr) {
    //   //     if (prev.length && curr === prev[prev.length - 1][0]) {
    //   //         prev[prev.length - 1].push(curr);
    //   //     }
    //   //     else {
    //   //         prev.push([curr]);
    //   //     }
    //   //     return prev;
    //   // }, [])
    //   //   .map(row => row[0])[0] || null