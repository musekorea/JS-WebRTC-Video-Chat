import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();

app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

app.get('/', (req, res) => {
  res.render('home.pug');
});

const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({ server: httpServer });

const AllSockets = [];

wsServer.on('connection', (socket) => {
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
      case 'nickname':
        console.log(messageObj.payload);
        socket.nickname = messageObj.payload;
    }
    console.log(AllSockets, AllSockets.length);
  });
});

httpServer.listen(8080, () => {
  console.log(`Server is running on Port 8080 💚`);
});
