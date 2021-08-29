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
  socket.on('enterRoom', (msg, CALLBACK) => {
    console.log(msg);
    setTimeout(CALLBACK, 1000);
  });
});

/* wsServer.on('connection', (socket) => {
  socket.nickname = `anonmyous`;
  AllSockets.push(socket);
  console.log(`Websocket is connected to the Browser💚`);
  socket.on('close', () => {
    console.log(`Websocket is disconnected form the Client💢`);
  });
  socket.on('message', (message, isBinary) => {
    const messageJSON = message.toString('utf8');
    const messageObj = JSON.parse(messageJSON);
    console.log(`New message`, messageObj);
    switch (messageObj.type) {
      case 'message':
        AllSockets.forEach((eachSocket) => {
          eachSocket.send(`${socket.nickname} : ${messageObj.payload}`);
        });
        break;
      case 'nickname':
        console.log(messageObj.payload);
        socket.nickname = messageObj.payload;
        break;
    }
  });
}); */

httpServer.listen(8080, () => {
  console.log(`Server is running on Port 8080 💚`);
});
