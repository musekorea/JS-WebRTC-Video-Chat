import express from 'express';
const app = express();

app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

app.get('/', (req, res) => {
  res.render('home.pug');
});

app.listen(8080, () => {
  console.log(`Server is running on Port 8080 💚`);
});
