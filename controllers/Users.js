import express from 'express';
import db from '../routes/database.js';

const router = express.Router();

// Endpoint "/users" untuk membaca data pengguna
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({
        error: 'Gagal membaca data pengguna',
      });
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint "/users/:id" untuk membaca data pengguna berdasarkan ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM users WHERE user_id = ?', id, (err, results) => {
    if (err) {
      res.status(500).json({
        error: 'Gagal membaca data pengguna',
      });
    } else if (results.length === 0) {
      res.status(404).json({
        error: 'Data pengguna tidak ditemukan',
      });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Endpoint "/users/:id" untuk memperbarui data pengguna berdasarkan ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, picture } = req.body;

  db.query(
    'UPDATE users SET username = ?, email = ?, password = ?, picture = ? WHERE user_id = ?',
    [username, email, password, picture, id],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: 'Gagal memperbarui data pengguna',
        });
      } else if (results.affectedRows === 0) {
        res.status(404).json({
          error: 'Data pengguna tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Data pengguna berhasil diperbarui',
        });
      }
    },
  );
});

// Endpoint "/users/:id" untuk menghapus data pengguna berdasarkan ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE user_id = ?', id, (err, results) => {
    if (err) {
      res.status(500).json({
        error: 'Gagal menghapus data pengguna',
      });
    } else if (results.affectedRows === 0) {
      res.status(404).json({
        error: 'Data pengguna tidak ditemukan',
      });
    } else {
      res.status(200).json({
        message: 'Data pengguna berhasil dihapus',
      });
    }
  });
});

export default router;
