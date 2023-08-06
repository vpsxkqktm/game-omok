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
    if (currentPlayer === BLACK && checkThreeThree(board, i, j)) {
      window.alert('3x3 is forbidden!');
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

  const checkThreeThree = (board, row, col) => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    let count = 0;
    for (let [dx, dy] of directions) {
      if (checkOpenThree(board, BLACK, row, col, dx, dy)) {
        count++;
        if (count >= 2) return true;
      }
    }
    return false;
  }

  const checkOpenThree = (board, player, row, col, dx, dy) => {
    const x1 = row + dx;
    const y1 = col + dy;
    const x2 = row + 2 * dx;
    const y2 = col + 2 * dy;
    const x3 = row + 3 * dx;
    const y3 = col + 3 * dy;
    const x4 = row + 4 * dx;
    const y4 = col + 4 * dy;
    const x5 = row + 5 * dx;
    const y5 = col + 5 * dy;
    const x0 = row - dx;
    const y0 = col - dy;
    return (
      x1 >= 0 && y1 >= 0 && x1 < BOARD_SIZE && y1 < BOARD_SIZE && board[x1][y1] === player &&
      x2 >= 0 && y2 >= 0 && x2 < BOARD_SIZE && y2 < BOARD_SIZE && board[x2][y2] === player &&
      x3 >= 0 && y3 >= 0 && x3 < BOARD_SIZE && y3 < BOARD_SIZE && board[x3][y3] === EMPTY &&
      x4 >= 0 && y4 >= 0 && x4 < BOARD_SIZE && y4 < BOARD_SIZE && board[x4][y4] === EMPTY &&
      x5 >= 0 && y5 >= 0 && x5 < BOARD_SIZE && y5 < BOARD_SIZE && board[x5][y5] === player &&
      x0 >= 0 && y0 >= 0 && x0 < BOARD_SIZE && y0 < BOARD_SIZE && board[x0][y0] === EMPTY
    );
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
