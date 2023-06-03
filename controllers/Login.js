import express from 'express';
import bcrypt from 'bcrypt';
import db from '../routes/database.js';

const router = express.Router();

// Endpoint "/login" untuk proses login
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Mengecek apakah data pengguna valid
    db.query('SELECT * FROM users WHERE username = ?', username, async (err, results) => {
      if (err) {
        res.status(500).json({
          error: 'Gagal melakukan login',
        });
      } else if (results.length > 0) {
        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
          res.status(200).json({
            message: 'Berhasil login',
          });
        } else {
          res.status(401).json({
            error: 'Kombinasi username dan password salah',
          });
        }
      } else {
        res.status(401).json({
          error: 'Kombinasi username dan password salah',
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Gagal melakukan login',
    });
  }
});

export default router;
