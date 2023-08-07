const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');  

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'build')));  

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);

    // Get the list of clients in the room
    const clients = io.sockets.adapter.rooms.get(room);

    // If there are two users in the room, start the game
    if (clients.size === 2) {
      console.log(`Starting game in room ${room}`);  // Add this line
      io.to(room).emit('game start');
    }
  });

  socket.on('move made', ({ row, col, player, room }) => {
    io.to(room).emit('move made', { row, col, player });
  });
});

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
