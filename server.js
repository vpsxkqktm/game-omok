const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const rooms = {}; // 각 룸의 상태 관리
const BLACK = 1;
const WHITE = 2;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('game over', (room) => {
    io.to(room).emit('game over'); // 모든 클라이언트에게 게임 오버 이벤트 전송
  });

  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
    if (!rooms[room]) {
      rooms[room] = {
        players: [null, null], // 두 플레이어 자리를 null로 초기화
        currentPlayer: BLACK,  // 첫 번째 플레이어는 BLACK으로 시작
      };
    }

    if (rooms[room].players[0] === null) {
      rooms[room].players[0] = socket.id;
      socket.emit('assign player', BLACK); // 첫 번째 플레이어에게 BLACK 할당
    } else if (rooms[room].players[1] === null) {
      rooms[room].players[1] = socket.id;
      socket.emit('assign player', WHITE); // 두 번째 플레이어에게 WHITE 할당
      io.to(room).emit('game start', { currentPlayer: BLACK }); // 게임 시작 이벤트 발송
    }
  });

  socket.on('move made', ({ row, col, player, room }) => {
    if (rooms[room].currentPlayer !== player || rooms[room].players[rooms[room].currentPlayer - 1] !== socket.id) {
      // 플레이어 순서가 맞지 않으면 리턴
      return;
    }
    io.to(room).emit('move made', { row, col, player });
    rooms[room].currentPlayer = rooms[room].currentPlayer === BLACK ? WHITE : BLACK;
  });
});

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
