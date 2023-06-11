import express from 'express';
import db from '../routes/database.js';

const router = express.Router();

// Endpoint "/trasic" untuk mendapatkan daftar trasic
router.get('/', (req, res) => {
  db.query('SELECT * FROM trasic', (err, results) => {
    if (err) {
      res.status(500).json({
        error: 'Gagal mendapatkan data trasic',
      });
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint "/trasic" untuk membuat trasic baru
router.post('/', (req, res) => {
  const { name, region, description, demo, picture } = req.body;

  db.query(
    'INSERT INTO trasic (name, region, description, demo, picture) VALUES (?, ?, ?, ?, ?)',
    [name, region, description, demo, picture],
    (err) => {
      if (err) {
        res.status(500).json({
          error: 'Gagal membuat trasic baru',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil membuat trasic baru',
        });
      }
    },
  );
});

// Endpoint "/trasic/:id" untuk mendapatkan detail trasic berdasarkan ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM trasic WHERE trasic_id = ?', id, (err, results) => {
    if (err) {
      res.status(500).json({
        error: 'Gagal mendapatkan detail trasic',
      });
    } else if (results.length === 0) {
      res.status(404).json({
        error: 'Trasic tidak ditemukan',
      });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Endpoint "/trasic/:id" untuk memperbarui trasic berdasarkan ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, region, description, demo, picture } = req.body;

  db.query(
    'UPDATE trasic SET name = ?, region = ?, description = ?, demo = ?, picture = ? WHERE trasic_id = ?',
    [name, region, description, demo, picture, id],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: 'Gagal memperbarui trasic',
        });
      } else if (results.affectedRows === 0) {
        res.status(404).json({
          error: 'Trasic tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil memperbarui trasic',
        });
      }
    },
  );
});

// Endpoint "/trasic/:id" untuk menghapus trasic berdasarkan ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM trasic WHERE trasic_id = ?', id, (err, results) => {
    if (err) {
      res.status(500).json({
        error: 'Gagal menghapus trasic',
      });
    } else if (results.affectedRows === 0) {
      res.status(404).json({
        error: 'Trasic tidak ditemukan',
      });
    } else {
      res.status(200).json({
        message: 'Berhasil menghapus trasic',
      });
    }
  });
});

export default router;
