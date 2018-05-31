import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from 'material-ui/Paper'
import Board from './Board'
import './GameDetails.css'

class GameDetails extends PureComponent {

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  // makeMoveOld = (toRow, toCell) => {
  //   const {game, updateGame} = this.props

  //   const board = game.board
  //   .map(
  //     // iterate over all rows
  //     (row, rowIndex) => row
  //     // per row, iterate over all cells
  //       .map((cell, cellIndex) => {
  //         if (rowIndex === toRow && cellIndex === toCell) return game.turn //return the cell filled with the symbol of the one who's turn it is
  //         else return cell // return the cell the way it was
  //     })
  //   )
  //   updateGame(game.id, board)
  // }

  // rows are rendered vertically as columns by our css, so toRow is referred to as 'toColumn'
  makeMove= (toRow, toCell) => {  // rows are rendered vertically as columns by our css
    const {game, updateGame} = this.props
    const board = game.board
    console.log(board)
    // from the current row, 
    const currentRow = board[toRow]
    //get only the empty cells, and check the length of this array to find how many empty positions there are
    const toCelln = currentRow.filter(cell => cell === null).length
    // if there are no empty cells in the column, return (and allow another move)
    if (toCelln === 0) return 
    // fill the last empty position with the symbol of the one who's turn it is = game.turn
    board[toRow][toCelln-1] = game.turn
    // returns the board with the new update
    updateGame(game.id, board)

  }



  render() {
    const {game, users, authenticated, userId} = this.props

    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    return (<Paper className="outer-paper">
      <h1>Game #{game.id}</h1>

      <p>Status: {game.status}</p>

      {
        game.status === 'started' &&
        player && player.symbol === game.turn &&
        <div>It's your turn!</div>
      }

      {
        game.status === 'pending' &&
        game.players.map(p => p.userId).indexOf(userId) === -1 &&
        <button onClick={this.joinGame}>Join Game</button>
      }

      {
        winner &&
        <p>Winner: {users[winner].firstName}</p>
      }

      <hr />

      {
        game.status !== 'pending' &&
        <div className="Board-container">
          <Board board={game.board} makeMove={this.makeMove} hasTurn={player.symbol === game.turn}/>
        </div>
      }
    </Paper>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGame
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)
