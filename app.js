import express from 'express';
import bodyParser from 'body-parser';
import db from './routes/database.js';

const app = express();
const port = 3000;

// Menggunakan body-parser untuk membaca data POST dalam format JSON
app.use(bodyParser.json());

// Endpoint utama "/"
app.get('/', (req, res) => {
  res.send('Selamat datang di aplikasi Express.js');
});

// Endpoint "/register" untuk mendaftar pengguna baru
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = { username, password };

  // Menyimpan data pengguna ke database
  db.query('INSERT INTO users SET ?', user, (err) => {
    if (err) {
      res.status(500).send('Gagal mendaftar pengguna');
    } else {
      res.status(200).send('Berhasil mendaftar pengguna');
    }
  });
});

// Endpoint "/login" untuk proses login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Mengecek apakah data pengguna valid
  db.query('SELECT * FROM users WHERE username = ?', username, (err, results) => {
    if (err) {
      res.status(500).send('Gagal melakukan login');
    }

    if (results.length > 0) {
      if (results[0].password === password) {
        res.status(200).send('Berhasil login');
      } else {
        res.status(401).send('Kombinasi username dan password salah');
      }
    } else {
      res.status(401).send('Kombinasi username dan password salah');
    }
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
