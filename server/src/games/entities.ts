import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = 'x' | 'o'
export type Row = [ Symbol | null, Symbol | null, Symbol | null, Symbol | null, Symbol | null, Symbol | null, Symbol | null ] // number of columns (default= 7)
export type Board = [ Row, Row, Row, Row , Row , Row  ] // number of rows (default= 6)

type Status = 'pending' | 'started' | 'finished'

const emptyRow: Row = [null, null, null, null, null, null, null] //number of columns (default= 7)
const emptyBoard: Board = [ emptyRow, emptyRow, emptyRow, emptyRow, emptyRow, emptyRow ] //number of rows (default= 6)

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: emptyBoard})
  board: Board

  @Column('char', {length:1, default: 'x'})
  turn: Symbol

  @Column('char', {length:1, nullable: true})
  winner: Symbol

  @Column('text', {default: 'pending'})
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]
}

@Entity()
@Index(['game', 'user', 'symbol'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  // comment out these lines when creating the database
  @Column()
  userId: number

  @Column('char', {length: 1})
  symbol: Symbol
}

// const createEmptyTable = () => 
//     new Array( 7 ).fill( null ).map( 
//         () => new Array( 6 ).fill( null ) 
//     );
     
//   let table = createEmptyTable()

//   const checkElements = ( [head, ...tail], matchCount = 0, lastElement = null ) => {
//     if ( matchCount === 3 && head === lastElement ) return true;
//     if ( tail.length === 0 ) return false;
//     if ( head === null ) return checkElements( tail );
//     if ( head === lastElement ) return checkElements( tail, matchCount + 1, head );
//     return checkElements( tail, 1, head );
// }

// const checkElements = arr => /([12]),\1,\1,\1/.test( arr.toString() );

// const checkColumns = table => 
//     table.reduce( 
//         (hasMatch, column) => {
//             console.log( hasMatch, column );
//             return hasMatch || checkElements( column ); 
//         },
//         false 
//     );

//     const checkRows = table => {
//       for ( let i = 0; i < table[0].length; ++i ) {
//           let rowArray = table.map( column => column[i] );
//           if ( checkElements( rowArray ) ) return true;
//       }
//       return false;
//   }

//   const checkTable = table => 
//     checkRows( table ) ||
//     checkColumns( table );