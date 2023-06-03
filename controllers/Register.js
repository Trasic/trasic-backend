import express from 'express';
import bcrypt from 'bcrypt';
import db from '../routes/database.js';

const router = express.Router();

// Mengecek apakah username atau email sudah digunakan
function getUserByUsernameOrEmail(username, email) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      },
    );
  });
}

// Menyimpan data pengguna ke database
function insertUser(username, email, password, picture) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        reject(err);
        return;
      }
      db.query(
        'INSERT INTO users (username, email, password, picture) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, picture],
        () => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  });
}

// Endpoint "/register" untuk mendaftar pengguna baru
router.post('/', async (req, res) => {
  const { username, email, password, picture } = req.body;

  try {
    // Mengecek apakah username atau email sudah digunakan
    const existingUser = await getUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Username atau email sudah digunakan',
      });
    }

    // Menyimpan data pengguna ke database dengan password terenkripsi
    await insertUser(username, email, password, picture);

    return res.status(200).json({
      message: 'Berhasil mendaftar pengguna',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Gagal mendaftar pengguna',
    });
  }
});

export default router;
