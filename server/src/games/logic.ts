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
      [0, 1, 2, 3].map(n => board.map(row => row[n])) as Row[]
      // [1, 2, 3, 4].map(n => board.map(row => row[n])) as Row[],
      // [2, 3, 4, 5].map(n => board.map(row => row[n])) as Row[]
    )
    .concat(
      [
        // diagonal winner ltr
        // //index [0]
        [0, 1, 2, 3].map(n => board[n][n] ),
        [1, 2, 3, 4].map(n => board[n-1][n] ),
        [2, 3, 4, 5].map(n => board[n-2][n] ),
        [3, 4, 5, 6].map(n => board[n-3][n] ),
        // // index [1]
        [0, 1, 2, 3].map(n => board[n+1][n] ),
        [1, 2, 3, 4].map(n => board[n][n] ),
        [2, 3, 4, 5].map(n => board[n-1][n] ),
        [3, 4, 5, 6].map(n => board[n-2][n] ),
        // // index [2]
        [0, 1, 2, 3].map(n => board[n+2][n] ),
        [1, 2, 3, 4].map(n => board[n+1][n] ),
        [2, 3, 4, 5].map(n => board[n][n] ),
        [3, 4, 5, 6].map(n => board[n-1][n] ),
        // // diagonal winner rtl
        // //index [0] working
        [0, 1, 2, 3].map(n => board[3-n][n]),
        [1, 2, 3, 4].map(n => board[4-n][n]),
        [2, 3, 4, 5].map(n => board[5-n][n]),
        [3, 4, 5, 6].map(n => board[6-n][n]),
        //index [1] working
        [0, 1, 2, 3].map(n => board[4-n][n]),
        [1, 2, 3, 4].map(n => board[5-n][n]),
        [2, 3, 4, 5].map(n => board[6-n][n]),
        [3, 4, 5, 6].map(n => board[7-n][n]),
        //index [2] working
        [0, 1, 2, 3].map(n => board[5-n][n]),
        [1, 2, 3, 4].map(n => board[6-n][n]),
        [2, 3, 4, 5].map(n => board[7-n][n]),
        [3, 4, 5, 6].map(n => board[8-n][n])
      ] as Row[]
    )
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] || null

export const finished = (board: Board): boolean =>
  board
    .reduce((a,b) => a.concat(b) as Row)
    .every(symbol => symbol !== null)