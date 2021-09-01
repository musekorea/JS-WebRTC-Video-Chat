import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

app.get('/', (req, res) => {
  res.render('home.pug');
});

const httpServer = http.createServer(app);
const socketServer = SocketIO(httpServer);

socketServer.on('connection', (socket) => {
  console.log(`Socket is connected 📌[${socket.id} ]`);
  socket.on('disconnect', (reason) => {
    console.log(reason);
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('byeRoom', socket.id);
    });
  });
  socket.onAny((anyEvent) => {
    console.log(`Socket Event:`, anyEvent);
  });
  socket.on('enterRoom', (roomName, hideRoom) => {
    socket.join(roomName);
    hideRoom();
    socket.to(roomName).emit('welcomeRoom', socket.id);
  });
  socket.on('sendMessage', (msg, roomName, addMessage) => {
    socket.to(roomName).emit('newMessage', msg);
    addMessage();
  });
});

httpServer.listen(8080, () => {
  console.log(`Server is listening on Port 8080 💚`);
});
