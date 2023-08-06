const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on('move made', ({ row, col, player, room }) => {
    io.to(room).emit('move made', { row, col, player });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
