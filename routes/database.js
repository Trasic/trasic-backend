import mysql from 'mysql';

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: '34.101.129.76',
  user: 'root',
  password: 'root',
  database: 'trasic_db',
});

// Membuka koneksi ke database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Terhubung ke database MySQL');
});

export default db;
