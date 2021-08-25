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
  AllSockets.push(socket);
  console.log(`Websocket is connected to the Browser💚`);
  socket.on('close', () => {
    console.log(`Websocket is disconnected form the Client💢`);
  });
  socket.on('message', (message, isBinary) => {
    const messageString = isBinary ? message : message.toString('utf8');
    console.log(`New message`, messageString);
    AllSockets.forEach((eachSocket) => {
      eachSocket.send(messageString);
    });
  });
});

httpServer.listen(8080, () => {
  console.log(`Server is running on Port 8080 💚`);
});
