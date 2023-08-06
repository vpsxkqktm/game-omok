import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
=======
import io from 'socket.io-client';
>>>>>>> main
import './App.css';

const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const App = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [seconds, setSeconds] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
<<<<<<< HEAD
=======
  const [roomCode, setRoomCode] = useState("");
  const socket = io("http://localhost:3000");  // replace with your server address
>>>>>>> main

  const handleClick = (i, j) => {
    if (board[i][j] !== EMPTY) return;
    setGameStarted(true);
<<<<<<< HEAD
    if (checkThreeThree(board, currentPlayer, i, j) || checkFourFour(board, currentPlayer, i, j)) {
      window.alert(currentPlayer === BLACK ? '흑돌은 삼삼이나 사사이 상황이므로 돌을 놓을 수 없습니다.' : '삼삼이 상황이므로 돌을 놓을 수 없습니다.');
      return;
    }
=======
>>>>>>> main
    const newBoard = [...board];
    newBoard[i][j] = currentPlayer;
    setBoard(newBoard);
    if (checkWin(newBoard, currentPlayer, i, j)) {
      window.alert(`Player ${currentPlayer === BLACK ? 'Black' : 'White'} won!`);
      resetBoard();
    } else {
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
      setSeconds(30);
    }
<<<<<<< HEAD
  }
=======
    socket.emit('move made', { row: i, col: j, player: currentPlayer, room: roomCode });
  };
>>>>>>> main

  const resetBoard = () => {
    setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(BLACK);
    setSeconds(30);
    setGameStarted(false);
<<<<<<< HEAD
  }
=======
  };

  const joinRoom = () => {
    socket.emit("join room", roomCode);
  };
>>>>>>> main

  useEffect(() => {
    let timerId = null;
    if (gameStarted && seconds > 0) {
      timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (gameStarted && seconds === 0) {
      window.alert('You lose');
      resetBoard();
    }
<<<<<<< HEAD
  
=======

    socket.on('move made', ({ row, col, player }) => {
      const newBoard = [...board];
      newBoard[row][col] = player;
      setBoard(newBoard);
      setCurrentPlayer(player === BLACK ? WHITE : BLACK);
      setSeconds(30);
    });

>>>>>>> main
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
<<<<<<< HEAD
=======
      socket.disconnect();
>>>>>>> main
    }
  }, [gameStarted, seconds]);

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

  const checkFourFour = (board, player, row, col) => {
    if (player !== BLACK) return false;  // 4x4는 흑돌에만 적용
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    let fourCount = 0;
    for (let [dx, dy] of directions) {
      for (let i = -1; i <= 0; i++) {
        let count = 1;  // 중심 돌을 포함
        for (let j = 1; j <= 3; j++) {
          const x1 = row + (i + j) * dx;
          const y1 = col + (i + j) * dy;
          const x2 = row - (i + j) * dx;
          const y2 = col - (i + j) * dy;
          if (x1 >= 0 && y1 >= 0 && x1 < BOARD_SIZE && y1 < BOARD_SIZE && board[x1][y1] === player) {
            count++;
          }
          if (x2 >= 0 && y2 >= 0 && x2 < BOARD_SIZE && y2 < BOARD_SIZE && board[x2][y2] === player) {
            count++;
          }
        }
        if (count === 4) {  // 돌이 4개인 경우
          // 양쪽 끝 셀 확인
          const x1 = row + (i + 4) * dx;
          const y1 = col + (i + 4) * dy;
          const x2 = row - (i + 4) * dx;
          const y2 = col - (i + 4) * dy;
          if ((x1 >= 0 && y1 >= 0 && x1 < BOARD_SIZE && y1 < BOARD_SIZE && board[x1][y1] === EMPTY) &&
              (x2 >= 0 && y2 >= 0 && x2 < BOARD_SIZE && y2 < BOARD_SIZE && board[x2][y2] === EMPTY)) {
            fourCount++;
            break;  // 한 방향에 대한 4x4를 찾는 경우를 최대 1번으로 제한
          }
        }
      }
    }
    return fourCount >= 2;
  }

  return (
    <div className="App">
<<<<<<< HEAD
=======
      <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
      <button onClick={joinRoom}>Join Room</button>
>>>>>>> main
      <div className="timer">Time remaining: {seconds} seconds</div>
      <div className="game-status">
        <div className="player">
          <div className="name">Player 1</div>
          <div className="stone emoji">⚫</div>
        </div>
        <div className="player">
          <div className="name">Player 2</div>
          <div className="stone emoji">⚪</div>
        </div>
        <div className="turn">
          Turn: 
          <div className="stone emoji">{currentPlayer === BLACK ? '⚫' : '⚪'}</div>
        </div>
      </div>
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
};

export default App;