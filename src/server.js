import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

app.use('/static', express.static(__dirname + '/public'));
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

httpServer.listen(8080, () => {
  console.log(`Server is listening on Port 8080 💚`);
});
