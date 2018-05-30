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
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] || null

export const finished = (board: Board): boolean =>
  board
    .reduce((a,b) => a.concat(b) as Row)
    .every(symbol => symbol !== null)


    // checkVertical(board) {
    //   // Check only if row is 3 or greater
    //   for (let r = 3; r < 6; r++) {
    //     for (let c = 0; c < 7; c++) {
    //       if (board[r][c]) {
    //         if (board[r][c] === board[r - 1][c] &&
    //             board[r][c] === board[r - 2][c] &&
    //             board[r][c] === board[r - 3][c]) {
    //           return board[r][c];    
    //         }
    //       }
    //     }
    //   }
    // }
    
    // checkHorizontal(board) {
    //   // Check only if column is 3 or less
    //   for (let r = 0; r < 6; r++) {
    //     for (let c = 0; c < 4; c++) {
    //       if (board[r][c]) {
    //         if (board[r][c] === board[r][c + 1] && 
    //             board[r][c] === board[r][c + 2] &&
    //             board[r][c] === board[r][c + 3]) {
    //           return board[r][c];
    //         }
    //       }
    //     }
    //   }
    // }
    
    // checkDiagonalRight(board) {
    //   // Check only if row is 3 or greater AND column is 3 or less
    //   for (let r = 3; r < 6; r++) {
    //     for (let c = 0; c < 4; c++) {
    //       if (board[r][c]) {
    //         if (board[r][c] === board[r - 1][c + 1] &&
    //             board[r][c] === board[r - 2][c + 2] &&
    //             board[r][c] === board[r - 3][c + 3]) {
    //           return board[r][c];
    //         }
    //       }
    //     }
    //   }
    // }
    
    // checkDiagonalLeft(board) {
    //   // Check only if row is 3 or greater AND column is 3 or greater
    //   for (let r = 3; r < 6; r++) {
    //     for (let c = 3; c < 7; c++) {
    //       if (board[r][c]) {
    //         if (board[r][c] === board[r - 1][c - 1] &&
    //             board[r][c] === board[r - 2][c - 2] &&
    //             board[r][c] === board[r - 3][c - 3]) {
    //           return board[r][c];
    //         }
    //       }
    //     }
    //   }
    // }

    // checkAll(board) {
    //   return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
    // }