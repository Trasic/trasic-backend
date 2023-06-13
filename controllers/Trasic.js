import express from 'express';
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import db from '../routes/database.js';

const router = express.Router();

// Inisialisasi Google Cloud Storage
const storage = new Storage({
  projectId: 'trasic-capstone-project',
  keyFilename: 'trasic-bucket/keyfile/serviceaccountkey.json',
});
const bucketName = 'trasic-bucket';

// Konfigurasi multer untuk mengunggah gambar
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5MB
  },
});

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
router.post('/', upload.single('pictureFile'), (req, res) => {
  const { name, region, description, demo } = req.body;
  const pictureFile = req.file;

  if (!pictureFile) {
    res.status(400).json({
      error: 'Gambar tidak ditemukan',
    });
    return;
  }

  // Mengunggah gambar ke Google Cloud Storage
  const blob = storage.bucket(bucketName).file(pictureFile.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', () => {
    res.status(500).json({
      error: 'Gagal mengunggah gambar',
    });
  });

  blobStream.on('finish', async () => {
    // Mengambil URL gambar yang diunggah
    const picture = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

    // Menyimpan data trasic ke database
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

  blobStream.end(pictureFile.buffer);
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
