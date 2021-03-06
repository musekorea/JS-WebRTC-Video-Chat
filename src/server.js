import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

app.use('/assets', express.static(process.cwd() + '/assets'));
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/public/views');

app.get('/', (req, res) => {
  res.render('home.pug');
});
app.get('/*', (req, res) => {
  res.redirect('/');
});

const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

socketServer.on('connect', (socket) => {
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('welcome');
  });
  socket.on('offer', (offer, roomName) => {
    socket.to(roomName).emit('offer', offer);
  });
  socket.on('answer', (answer, roomName) => {
    socket.to(roomName).emit('answer', answer);
  });
  socket.on('ice', (ice, roomName) => {
    console.log('Sent ICE Candidate');
    socket.to(roomName).emit('ice', ice);
  });
});
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is listening on Port 8080 💚`);
});
