import React from 'react'
import './Board.css'

const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {
  return (
    <button
      className={symbol? `board-tile symbol-${symbol}` : `board-tile`}
      disabled={!hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    >{' '}</button>
  )
}

export default ({board, makeMove, hasTurn}) => board
  .map((cells, rowIndex) =>
  <div key={rowIndex} className="board-row">
    {cells.map((symbol, cellIndex) => renderCel(makeMove, rowIndex, cellIndex, symbol, hasTurn))}
  </div>
)
