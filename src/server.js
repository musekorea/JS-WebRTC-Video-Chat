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
  socket.onAny((anyEvent) => {
    console.log(`Socket Event:`, anyEvent);
  });
  socket.on('enterRoom', (roomName, hideRoom) => {
    socket.join(roomName);
    hideRoom();
  });
});

httpServer.listen(8080, () => {
  console.log(`Server is running on Port 8080 💚`);
});
