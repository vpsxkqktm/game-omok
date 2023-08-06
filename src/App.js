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
    const newBoard = [...board];
    newBoard[i][j] = currentPlayer;
    if (checkThreeThree(newBoard, currentPlayer, i, j)) {
      window.alert('삼삼이 상황이므로 돌을 놓을 수 없습니다.');
      return;  // 돌을 두지 않음
    }
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
    if (player !== BLACK) return false;  // 삼삼은 흑돌에만 적용
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    let threeCount = 0;
    for (let [dx, dy] of directions) {
      let count = 1; // 중심 돌을 포함
      for (let i = 1; i <= 2; i++) { // 중심 돌의 양쪽 2개 셀 확인
        const x1 = row + i * dx;
        const y1 = col + i * dy;
        const x2 = row - i * dx;
        const y2 = col - i * dy;
        if (x1 >= 0 && y1 >= 0 && x1 < BOARD_SIZE && y1 < BOARD_SIZE && board[x1][y1] === player) {
          count++;
        }
        if (x2 >= 0 && y2 >= 0 && x2 < BOARD_SIZE && y2 < BOARD_SIZE && board[x2][y2] === player) {
          count++;
        }
      }
      if (count === 3) { // 돌이 3개인 경우
        // 양쪽 끝 셀 확인
        const x1 = row + 3 * dx;
        const y1 = col + 3 * dy;
        const x2 = row - 3 * dx;
        const y2 = col - 3 * dy;
        if (x1 >= 0 && y1 >= 0 && x1 < BOARD_SIZE && y1 < BOARD_SIZE && board[x1][y1] === EMPTY &&
            x2 >= 0 && y2 >= 0 && x2 < BOARD_SIZE && y2 < BOARD_SIZE && board[x2][y2] === EMPTY) {
          threeCount++;
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
