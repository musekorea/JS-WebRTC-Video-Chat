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
  console.log(socket.rooms);
  console.log(`Socket is connected 📌[${socket.id} ]`);
  socket.on('disconnect', (reason) => {
    console.log(reason);
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('byeRoom', socket.nickName);
    });
  });
  socket.onAny((anyEvent) => {
    console.log(`Socket Event:`, anyEvent);
  });
  socket.on('makeNick', (nickName, showRoom) => {
    if (nickName === '') {
      socket.nickName = `anonymous`;
      showRoom(socket.nickName);
    } else {
      socket.nickName = nickName;
      showRoom(nickName);
    }
  });
  socket.on('enterRoom', (roomName, showMsg) => {
    socket.join(roomName);
    showMsg(socket.nickName, roomName);
    socket.to(roomName).emit('welcomeRoom', socket.nickName);
  });
  socket.on('sendMessage', (msg, nickName, roomName, addMessage) => {
    socket.to(roomName).emit('newMessage', msg, nickName);
    addMessage(nickName);
  });
});

httpServer.listen(8080, () => {
  console.log(`Server is listening on Port 8080 💚`);
});
