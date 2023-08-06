import React, { useState } from 'react';
import './App.css';

const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const App = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);

  const handleClick = (i, j) => {
    if (board[i][j] !== EMPTY) return;
    if (checkThreeThree(board, currentPlayer, i, j)) {
      window.alert('3x3 is forbidden');
      return;
    }
    const newBoard = [...board];
    newBoard[i][j] = currentPlayer;
    setBoard(newBoard);
    if (checkWin(newBoard, currentPlayer, i, j)) {
      window.alert(`Player ${currentPlayer === BLACK ? 'Black' : 'White'} won!`);
      resetBoard();
    } else {
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    }
  }

  const resetBoard = () => {
    setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(BLACK);
  }

  const checkWin = (board, player, row, col) => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let [dx, dy] of directions) {
      let count = 0;
      for (let i = -4; i <= 4; i++) {
        const x = row + i * dx;
        const y = col + i * dy;
        if (x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE && board[x][y] === player) {
          count++;
          if (count === 5) return true;
        } else {
          count = 0;
        }
      }
    }
    return false;
  }

  const checkThreeThree = (board, player, row, col) => {
    if (player !== BLACK) return false;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    let threeCount = 0;
    for (let [dx, dy] of directions) {
      let count = 0;
      for (let i = -4; i <= 4; i++) {
        const x = row + i * dx;
        const y = col + i * dy;
        if (x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE && board[x][y] === player) {
          count++;
          if (count === 3 && 
              x + dx >= 0 && y + dy >= 0 && x + dx < BOARD_SIZE && y + dy < BOARD_SIZE &&
              x - 3 * dx >= 0 && y - 3 * dy >= 0 && x - 3 * dx < BOARD_SIZE && y - 3 * dy < BOARD_SIZE &&
              board[x + dx][y + dy] === EMPTY && board[x - 3 * dx][y - 3 * dy] === EMPTY) {
            threeCount++;
          }
        } else {
          count = 0;
        }
      }
    }
    return threeCount >= 2;
  }

  return (
    <div className="App">
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div key={j} className="cell" onClick={() => handleClick(i, j)}>
                {cell === BLACK && <div className="stone black" />}
                {cell === WHITE && <div className="stone white" />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={resetBoard}>Reset Board</button>
    </div>
  );
}

export default App;
