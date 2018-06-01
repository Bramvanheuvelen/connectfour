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
      [
      // vertical winner [0]
      [0, 1, 2, 3].map(n => board[n][0] ),
      [1, 2, 3, 4].map(n => board[n][0] ),
      [2, 3, 4, 5].map(n => board[n][0] ),
      // vertical winner [1]
      [0, 1, 2, 3].map(n => board[n][1] ),
      [1, 2, 3, 4].map(n => board[n][1] ),
      [2, 3, 4, 5].map(n => board[n][1] ),
      // vertical winner [2]
      [0, 1, 2, 3].map(n => board[n][2] ),
      [1, 2, 3, 4].map(n => board[n][2] ),
      [2, 3, 4, 5].map(n => board[n][2] ),
      // vertical winner [3]
      [0, 1, 2, 3].map(n => board[n][3] ),
      [1, 2, 3, 4].map(n => board[n][3] ),
      [2, 3, 4, 5].map(n => board[n][3] ),
      // vertical winner [4]
      [0, 1, 2, 3].map(n => board[n][4] ),
      [1, 2, 3, 4].map(n => board[n][4] ),
      [2, 3, 4, 5].map(n => board[n][4] ),
      // vertical winner [5]
      [0, 1, 2, 3].map(n => board[n][5] ),
      [1, 2, 3, 4].map(n => board[n][5] ),
      [2, 3, 4, 5].map(n => board[n][5] ),
      // vertical winner [6]
      [0, 1, 2, 3].map(n => board[n][6] ),
      [1, 2, 3, 4].map(n => board[n][6] ),
      [2, 3, 4, 5].map(n => board[n][6] ),
    ] as Row[],
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
    .concat(
      [
        // horizontal winner
        // //index [0]
        [0].map(n => board[0][n] && board[0][n+1] && board[0][n+2] && board[0][n+3]),
        [0].map(n => board[0][n+1] && board[0][n+2] && board[0][n+3] && board[0][n+4]),
        [0].map(n => board[0][n+2] && board[0][n+3] && board[0][n+4] && board[0][n+5]),
        [0].map(n => board[0][n+3] && board[0][n+4] && board[0][n+5] && board[0][n+6]),
        //index=[1]
        [1].map(n => board[1][n-1] && board[1][n] && board[1][n+1] && board[1][n+2]),
        [1].map(n => board[1][n] && board[1][n+1] && board[1][n+2] && board[1][n+3]),
        [1].map(n => board[1][n+1] && board[1][n+2] && board[1][n+3] && board[1][n+4]),
        [1].map(n => board[1][n+2] && board[1][n+3] && board[1][n+4] && board[1][n+5]),
        // //index=[2]
        [2].map(n => board[2][n-2] && board[2][n-1] && board[2][n] && board[2][n+1]),
        [2].map(n => board[2][n-1] && board[2][n] && board[2][n+1] && board[2][n+2]),
        [2].map(n => board[2][n] && board[2][n+1] && board[2][n+2] && board[2][n+3]),
        [2].map(n => board[2][n+1] && board[2][n+2] && board[2][n+3] && board[2][n+4]),
        // //index=[3]
        [3].map(n => board[3][n-3] && board[3][n-2] && board[3][n-1] && board[3][n]),
        [3].map(n => board[3][n-2] && board[3][n-1] && board[3][n] && board[3][n+1]),
        [3].map(n => board[3][n-1] && board[3][n] && board[3][n+1] && board[3][n+2]),
        [3].map(n => board[3][n] && board[3][n+1] && board[3][n+2] && board[3][n+3]),
        // //index=[4]
        [4].map(n => board[4][n-4] && board[4][n-3] && board[4][n-2] && board[4][n-1]),
        [4].map(n => board[4][n-3] && board[4][n-2] && board[4][n-1] && board[4][n]),
        [4].map(n => board[4][n-2] && board[4][n-1] && board[4][n] && board[4][n+1]),
        [4].map(n => board[4][n-1] && board[4][n] && board[4][n+1] && board[4][n+2]),
        // //index=[5]
        [5].map(n => board[5][n-5] && board[5][n-4] && board[5][n-3] && board[5][n-2]),
        [5].map(n => board[5][n-4] && board[5][n-3] && board[5][n-2] && board[5][n-1]),
        [5].map(n => board[5][n-3] && board[5][n-2] && board[5][n-1] && board[5][n]),
        [5].map(n => board[5][n-2] && board[5][n-2] && board[5][n] && board[5][n+1])
      ] as Row[]
    )
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] || null

export const finished = (board: Board): boolean =>
  board
    .reduce((a,b) => a.concat(b) as Row)
    .every(symbol => symbol !== null)