import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = .5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // create array-of-arrays of true/false values
    initialBoard = Array.from({ length: nrows }).map(y => {
      let row = Array.from({ length: ncols }).map(x =>
        (chanceLightStartsOn - Math.random() >= 0));
      return row;
    });
    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    return (board.flat().every(lit => !lit))
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      let boardCopy = oldBoard.map(row => row.slice());

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);


      // return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon(board)) {
    return (
      <div>
        <h1>You've won! Hurrah!</h1>
      </div>
    )
  }

  // make table board
  return (
    <div className="Board">
      <table><tbody>
        {board.map((row, y) => {
          return (
            <tr>
              {
                row.map((col, x) =>
                  <Cell
                    flipCellsAroundMe={flipCellsAround}
                    isLit={col}
                    y={y}
                    x={x}
                  />)
              }
            </tr>
          )
        })}
      </tbody></table>
    </div>
  )

}

export default Board;
