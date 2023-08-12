import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const socket = io("http://124.56.74.13:3000");

const App = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [myPlayer, setMyPlayer] = useState(null);
  const [seconds, setSeconds] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [hasCreatedRoom, setHasCreatedRoom] = useState(false);
  const [hasEnteredRoom, setHasEnteredRoom] = useState(false);

  console.log("Current Player:", currentPlayer, "My Player:", myPlayer);

  const handleMoveMade = ({ row, col, player }) => {
    const newBoard = [...board];
    newBoard[row][col] = player;
    setBoard(newBoard);
    setCurrentPlayer(player === BLACK ? WHITE : BLACK);
    setSeconds(30);
  };

  const handleClick = (i, j) => {
    console.log("Cell clicked:", i, j);
  
    // 내 차례가 아니면 리턴
    if (currentPlayer !== myPlayer) {
      console.log("Not your turn");
      return;
    }
  
    if (board[i][j] !== EMPTY) {
      console.log("Cell already occupied");
      return;
    }
  
    if (myPlayer === BLACK && (checkThreeThree(board, myPlayer, i, j) || checkFourFour(board, myPlayer, i, j))) {
      window.alert("Illegal move due to three-three or four-four rule"); // 콘솔 대신 메시지 박스로 출력
      return;
    }
  
    const newBoard = [...board];
    newBoard[i][j] = myPlayer;
    setBoard(newBoard);
  
    if (checkWin(newBoard, myPlayer, i, j)) {
      socket.emit('game over', roomCode); // 서버에 게임 오버 이벤트 전송
      window.alert('You won!');
      resetBoard();
    } else {
      setSeconds(30);
      socket.emit('move made', { row: i, col: j, player: myPlayer, room: roomCode });
    }
  };

  const resetBoard = () => {
    setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(BLACK);
    setSeconds(30);
    setGameStarted(false);
  };

  const joinRoom = () => {
    socket.emit("join room", roomCode);
    setHasCreatedRoom(true);
    setMyPlayer(BLACK); // 첫 번째 참가자는 흑돌
  };

  useEffect(() => {
    let timerId = null;
    if (gameStarted && seconds > 0) {
      timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (gameStarted && seconds === 0) {
      window.alert('You lose');
      resetBoard();
      // 게임이 끝났을 때만 소켓 연결을 끊는다.
      socket.disconnect();
    }
  
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [gameStarted, seconds]);
  

  useEffect(() => {
    console.log("Setting up socket event listeners...");

    const handleAssignPlayer = (player) => {
      setMyPlayer(player);
    };

    socket.on('assign player', handleAssignPlayer);
  
    const handleMoveMade = ({ row, col, player }) => {
      const newBoard = [...board];
      newBoard[row][col] = player;
      setBoard(newBoard);
      setCurrentPlayer(player === BLACK ? WHITE : BLACK);
      setSeconds(30);
    };

    const handleGameOver = () => {
      if (myPlayer !== currentPlayer) {
        window.alert('You lost.');
      }
      resetBoard();
    };
    
    socket.on('game over', handleGameOver);

    const handleGameStart = ({ currentPlayer }) => {
      console.log("Game start event received");
      setHasEnteredRoom(true);
      setCurrentPlayer(currentPlayer);
      setGameStarted(true); // 게임 시작 상태 변경
    };
  
    socket.on('move made', handleMoveMade);
    socket.on('game start', handleGameStart);
  
    return () => {
      console.log("Tearing down socket event listeners...");
      socket.off('move made', handleMoveMade);
      socket.off('game start', handleGameStart);
      socket.off('assign player', handleAssignPlayer);
      socket.off('game over', handleGameOver); // 이벤트 리스너 제거
    };
  }, [board, currentPlayer, myPlayer]);
  

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
      {!hasCreatedRoom ? (
        <>
          <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : !hasEnteredRoom ? (
        <p>2222222222222222</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default App;
