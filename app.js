import express from 'express';
import bodyParser from 'body-parser';
import Register from './controllers/Register.js';
import Login from './controllers/Login.js';
import Users from './controllers/Users.js';
import Trasic from './controllers/Trasic.js';

const app = express();
const port = 3000;

// Menggunakan body-parser untuk membaca data POST dalam format JSON
app.use(bodyParser.json());

// Endpoint utama "/"
app.get('/', (req, res) => {
  res.send('Selamat datang di aplikasi Express.js');
});

// Menggunakan controller untuk endpoint "/register"
app.use('/register', Register);

// Menggunakan controller untuk endpoint "/login"
app.use('/login', Login);

// Menggunakan controller untuk endpoint "/users"
app.use('/users', Users);

// Menggunakan controller untuk endpoint "/trasic"
app.use('/trasic', Trasic);

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
